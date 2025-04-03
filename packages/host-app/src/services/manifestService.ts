import { GuestManifest } from "@microfrontend-iframe/core-lib/types";

const manifestCache: Record<string, GuestManifest> = {};

const DEFAULT_MANIFEST_URLS = [
  "http://localhost:5174/manifest.json",
  "http://localhost:5175/manifest.json",
  "http://localhost:5176/manifest.json",
];

async function fetchManifest(url: string): Promise<GuestManifest | null> {
  try {
    console.log(`Fetching manifest from: ${url}`);
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      console.warn(
        `Failed to fetch manifest from ${url}: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const manifest = await response.json();
    console.log(`Successfully loaded manifest for: ${manifest.name}`);
    return manifest as GuestManifest;
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

/**
 * Loads all manifests from the configured URLs
 */
export async function loadManifests(): Promise<GuestManifest[]> {
  const manifestUrls = import.meta.env.VITE_MANIFEST_URLS
    ? JSON.parse(import.meta.env.VITE_MANIFEST_URLS as string)
    : DEFAULT_MANIFEST_URLS;

  console.log("Loading manifests from:", manifestUrls);

  const manifestPromises = manifestUrls.map(fetchManifest);
  const results = await Promise.all(manifestPromises);

  const validManifests = results.filter((m) => m !== null) as GuestManifest[];

  console.log(`Loaded ${validManifests.length} valid manifests`);
  return validManifests;
}

/**
 * Gets the base URLs for guest apps
 */
export function getGuestBaseUrls(): Record<string, string> {
  const baseUrlsFromEnv = import.meta.env.VITE_GUEST_BASE_URLS
    ? JSON.parse(import.meta.env.VITE_GUEST_BASE_URLS as string)
    : {};

  return {
    app1: "http://localhost:5174",
    app2: "http://localhost:5175",
    app3: "http://localhost:5176",
    ...baseUrlsFromEnv,
  };
}
