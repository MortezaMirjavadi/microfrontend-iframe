import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  useReactRouteSync,
  BottomSheetOpener,
  useReactBottomSheetMode,
} from "../../core-lib/src/adapters/react";

const Dashboard = () => {
  const isBottomSheet = useReactBottomSheetMode();

  return (
    <div>
      <h2>App 1: Dashboard</h2>
      {isBottomSheet && (
        <div className="bottom-sheet-badge">Bottom Sheet Mode</div>
      )}
      <div style={{ marginTop: "20px" }}>
        <BottomSheetOpener
          appId="app3"
          path="/dashboard"
          style={{ marginRight: "10px" }}
        >
          Open Analytics
        </BottomSheetOpener>
      </div>
    </div>
  );
};

const Settings = () => <h2>App 1: Settings</h2>;
const NotFound = () => <h2>App 1: Not Found</h2>;

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useReactRouteSync(location.pathname, navigate);

  return (
    <div>
      <h1>Guest App 1</h1>
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
