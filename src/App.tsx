import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth-context";
import { LocationProvider } from "./lib/location-context";
import { ThemeProvider } from "./lib/theme-context";
import Home from "./components/home";
import Login from "./components/auth/LoginPage";
import Register from "./components/auth/RegisterPage";
// import ForgotPassword from "./components/auth/ForgotPassword";
// import ResetPassword from "./components/auth/ResetPassword";
import { useRoutes } from "react-router-dom";
import routes from "tempo-routes";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Routes are now defined directly in the App component

function App() {
  // Create a separate element for tempo routes
  const tempoRoutesElement = import.meta.env.VITE_TEMPO
    ? useRoutes(routes)
    : null;

  return (
    <AuthProvider>
      <ThemeProvider>
        <LocationProvider>
          {tempoRoutesElement}
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* For the tempo routes */}
            {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </LocationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
