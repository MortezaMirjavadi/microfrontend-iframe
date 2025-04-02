import { useMemo, useCallback } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { GuestManifest, MenuItem } from "@microfrontend-iframe/core-lib/types";
import { useManifests } from "./hooks/useManifests";
import GuestFrame from "./components/GuestFrame";
import SidebarMenu from "./components/SidebarMenu";
import Layout from "./components/Layout";
import { BottomSheetProvider } from "./context/BottomSheetContext";
import AppLauncher from "./components/AppLauncher";

function App() {
  const { manifests, loading, error } = useManifests();
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleGuestRouteChange = useCallback(
    (guestId: string, path: string) => {
      const manifest = manifests.find((m) => m.id === guestId);
      if (!manifest) return;

      const regexMatch = manifest.routeRegex.match(/^\^(\/[^/(?]+)/);
      const basePath = regexMatch ? regexMatch[1] : `/${manifest.id}`;

      const newUrl = `${basePath}${path}`;

      window.history.replaceState(null, "", newUrl);
    },
    [manifests]
  );

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

        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "10px",
            background: "#333",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 1000,
          }}
        >
          <div>Active Guest: {activeGuest?.id || "None"}</div>
          <div>Path: {guestPath}</div>
          <div>URL: {window.location.pathname}</div>
        </div>
      </Layout>
    </BottomSheetProvider>
  );
}

export default App;
