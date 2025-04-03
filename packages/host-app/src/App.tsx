import { useMemo, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { GuestManifest, MenuItem } from "@microfrontend-iframe/core-lib/types";
import { useManifests } from "./hooks/useManifests";
import GuestFrame from "./components/GuestFrame";
import SidebarMenu from "./components/SidebarMenu";
import Layout from "./components/Layout";
import { BottomSheetProvider } from "./context/BottomSheetContext";
import AppLauncher from "./components/AppLauncher";
import DevModeToggle from "./components/DevModeToggle";

function App() {
  const { manifests: originalManifests, loading, error } = useManifests();
  const [manifests, setManifests] = useState<GuestManifest[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (originalManifests.length > 0) {
      setManifests(originalManifests);
    }
  }, [originalManifests]);

  const { activeGuest, guestPath } = useMemo(() => {
    if (loading || error || manifests.length === 0) {
      return { activeGuest: null, guestPath: "/" };
    }

    const currentManifest = manifests.find((m) => {
      const regex = new RegExp(m.routeRegex);
      return regex.test(location.pathname);
    });

    if (!currentManifest) {
      return { activeGuest: null, guestPath: "/" };
    }

    const regex = new RegExp(currentManifest.routeRegex);
    const match = location.pathname.match(regex);
    let internalPath = match && match[1] ? match[1] : "/";

    if (!internalPath.startsWith("/")) {
      internalPath = "/" + internalPath;
    }

    return { activeGuest: currentManifest, guestPath: internalPath };
  }, [location.pathname, manifests, loading, error]);

  const handleMenuClick = useCallback(
    (manifest: GuestManifest, menuItem: MenuItem) => {
      const regexMatch = manifest.routeRegex.match(/^\^(\/[^/(?]+)/);
      const basePath = regexMatch ? regexMatch[1] : `/${manifest.id}`;

      const targetUrl = `${basePath}${menuItem.path}`;
      console.log(`Menu click navigating to: ${targetUrl}`);

      navigate(targetUrl);
    },
    [navigate]
  );

  const handleDevModeToggle = useCallback((appId: string, enabled: boolean) => {
    setManifests((prev: any) =>
      prev.map((app: any) => {
        if (app.id === appId && app.proxy) {
          return {
            ...app,
            proxy: {
              ...app.proxy,
              enabled,
            },
          };
        }
        return app;
      })
    );
  }, []);

  if (loading) return <div>Loading configuration...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!manifests.length) return <div>No applications configured.</div>;

  return (
    <BottomSheetProvider>
      <Layout
        sidebar={
          <SidebarMenu manifests={manifests} onMenuClick={handleMenuClick} />
        }
        bottomBar={<AppLauncher manifests={manifests} />}
      >
        <GuestFrame activeGuest={activeGuest} guestPath={guestPath} />

        {location.pathname === "/" && manifests.length > 0 && (
          <Navigate
            to={`/${manifests[0].id}${manifests[0].menuItems[0].path}`}
            replace
          />
        )}

        <DevModeToggle manifests={manifests} onToggle={handleDevModeToggle} />
      </Layout>
    </BottomSheetProvider>
  );
}

export default App;
