import { useState, useEffect, useCallback } from "react";
import { GuestManifest } from "@microfrontend-iframe/core-lib/types";
import {
  fetchManifests,
  getManifestByAppId,
} from "../services/manifestService";

export function useManifests() {
  const [manifests, setManifests] = useState<GuestManifest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchManifests()
      .then((data) => {
        setManifests(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load manifests:", err);
        setError("Failed to load application configurations.");
        setManifests([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadManifestById = useCallback(
    async (appId: string): Promise<GuestManifest | null> => {
      const existing = manifests.find((m) => m.id === appId);
      if (existing) {
        return existing;
      }

      setLoading(true);
      try {
        const manifest = await getManifestByAppId(appId);
        if (manifest) {
          setManifests((prev) => [...prev, manifest]);
        }
        return manifest;
      } catch (err) {
        console.error(`Failed to load manifest for ${appId}:`, err);
        setError(`Failed to load application ${appId}.`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [manifests]
  );

  return {
    manifests,
    loading,
    error,
    loadManifestById,
  };
}
