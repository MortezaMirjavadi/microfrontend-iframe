import { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { openAppInBottomSheet } from "../../core-lib/src/bottomSheet";

const Dashboard = () => (
  <div>
    <h2>App 1: Dashboard</h2>
    <button
      onClick={() => {
        openAppInBottomSheet("app3", "/reports", "60vh");
      }}
    >
      Test
    </button>
  </div>
);
const Settings = () => <h2>App 1: Settings</h2>;
const NotFound = () => <h2>App 1: Not Found</h2>;

const hostOrigin = import.meta.env.VITE_HOST_ORIGIN || window.location.origin;

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  console.log("Guest App 1 rendering at path:", location.pathname);

  // Listen for navigation events from the host
  useEffect(() => {
    const handleNavigation = (event: CustomEvent<{ path: string }>) => {
      const path = event.detail.path;
      console.log(`Received navigation request to: ${path}`);

      if (location.pathname !== path) {
        console.log(`Navigating from ${location.pathname} to ${path}`);
        navigate(path);
      }
    };

    window.addEventListener("appNavigation", handleNavigation as EventListener);
    return () => {
      window.removeEventListener(
        "appNavigation",
        handleNavigation as EventListener
      );
    };
  }, [navigate, location.pathname]);

  // Report route changes back to the host
  useEffect(() => {
    console.log(`Route changed to: ${location.pathname}`);

    // Send message to host about the route change
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: "routeChange",
          path: location.pathname,
          appId: "app1",
        },
        hostOrigin
      );
    }
  }, [location.pathname]);

  return (
    <div>
      <h1>Guest App 1</h1>
      <div
        style={{ background: "#f0f0f0", padding: "8px", marginBottom: "16px" }}
      >
        <p>Current path: {location.pathname}</p>
      </div>

      <nav>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/settings")}>Settings</button>
      </nav>

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
