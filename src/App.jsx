import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ScenarioProvider } from './context/ScenarioContext';
import { AlertsProvider } from './context/AlertsContext';
import { ResponseProvider } from './context/ResponseContext';

// Layout
import AppShell from './components/layout/AppShell';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import SignUpPage from './pages/public/SignUpPage';
import OnboardingModal from './pages/public/OnboardingModal';

// Authenticated Pages
import OverviewDashboard from './pages/app/OverviewDashboard';
import StormMonitorPage from './pages/app/StormMonitorPage';
import RiskAnalysisPage from './pages/app/RiskAnalysisPage';
import InteractiveMapPage from './pages/app/InteractiveMapPage';
import InfrastructurePage from './pages/app/InfrastructurePage';
import SimulatorPage from './pages/app/SimulatorPage';
import AiCommandCenterPage from './pages/app/AiCommandCenterPage';
import ResponsePlannerPage from './pages/app/ResponsePlannerPage';
import AlertsPage from './pages/app/AlertsPage';
import IncidentReportsPage from './pages/app/IncidentReportsPage';
import SettingsPage from './pages/app/SettingsPage';

// Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, onboardingCompleted, setOnboardingCompleted } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <OnboardingModal
        isOpen={!onboardingCompleted}
        onClose={() => setOnboardingCompleted(true)}
      />
      {children}
    </>
  );
}

// Public Route Guard (Redirects to /app if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <ScenarioProvider>
            <AlertsProvider>
              <ResponseProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <LoginPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <PublicRoute>
                        <SignUpPage />
                      </PublicRoute>
                    }
                  />

                  {/* Authenticated Routes with AppShell */}
                  <Route
                    path="/app"
                    element={
                      <ProtectedRoute>
                        <AppShell />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<OverviewDashboard />} />
                    <Route path="storm" element={<StormMonitorPage />} />
                    <Route path="risk" element={<RiskAnalysisPage />} />
                    <Route path="map" element={<InteractiveMapPage />} />
                    <Route path="infrastructure" element={<InfrastructurePage />} />
                    <Route path="simulator" element={<SimulatorPage />} />
                    <Route path="ai" element={<AiCommandCenterPage />} />
                    <Route path="response" element={<ResponsePlannerPage />} />
                    <Route path="alerts" element={<AlertsPage />} />
                    <Route path="reports" element={<IncidentReportsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ResponseProvider>
            </AlertsProvider>
          </ScenarioProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
