import { GuestManifest } from "@microfrontend-iframe/core-lib/types";

const manifestCache: Record<string, GuestManifest> = {};

export async function fetchManifest(
  url: string
): Promise<GuestManifest | null> {
  try {
    if (manifestCache[url]) {
      console.log(`Using cached manifest for ${url}`);
      return manifestCache[url];
    }

    console.log(`Fetching manifest from ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        `Failed to fetch manifest from ${url}: ${response.statusText}`
      );
      return null;
    }

    const manifest = (await response.json()) as GuestManifest;
    manifestCache[url] = manifest;
    return manifest;
  } catch (error) {
    console.error(`Error fetching manifest from ${url}:`, error);
    return null;
  }
}

export async function fetchManifests(): Promise<GuestManifest[]> {
  const manifestUrls: string[] = [];

  for (const key in import.meta.env) {
    if (key.startsWith("VITE_") && key.endsWith("_MANIFEST_URL")) {
      const url = import.meta.env[key] as string;
      if (url) {
        manifestUrls.push(url);
      }
    }
  }

  if (!manifestUrls.length) {
    console.warn("No VITE_..._MANIFEST_URL environment variables found.");
    return [];
  }

  const manifests = await Promise.all(
    manifestUrls.map((url) => fetchManifest(url))
  );

  return manifests.filter((m): m is GuestManifest => m !== null);
}

export async function getManifestByAppId(
  appId: string
): Promise<GuestManifest | null> {
  const cachedManifest = Object.values(manifestCache).find(
    (m) => m.id === appId
  );
  if (cachedManifest) {
    return cachedManifest;
  }

  let manifestUrl: string | undefined;
  for (const key in import.meta.env) {
    if (key.startsWith("VITE_") && key.endsWith("_MANIFEST_URL")) {
      if (key.toLowerCase().includes(appId.toLowerCase())) {
        manifestUrl = import.meta.env[key] as string;
        break;
      }
    }
  }

  if (!manifestUrl) {
    console.error(`No manifest URL found for app ID: ${appId}`);
    return null;
  }

  return fetchManifest(manifestUrl);
}
