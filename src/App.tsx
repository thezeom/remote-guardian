
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Sites from "./pages/Sites";
import DetectedSites from "./pages/DetectedSites";
import Equipment from "./pages/Equipment";
import SiteEquipment from "./pages/SiteEquipment";
import EquipmentDetail from "./pages/EquipmentDetail";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import DemoLayout from "./components/DemoLayout";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Route publique pour la page d'accueil */}
          <Route path="/" element={<Landing />} />

          {/* Route de démo pour les développeurs backend */}
          <Route path="demo" element={<DemoLayout />}>
            <Route path="dashboard" element={<Index />} />
            <Route path="sites" element={<Sites />} />
            <Route path="sites/detected" element={<DetectedSites />} />
            <Route path="sites/:siteId/equipment" element={<SiteEquipment />} />
            <Route path="equipements" element={<Equipment />} />
            <Route path="equipements/:id" element={<EquipmentDetail />} />
            <Route path="alertes" element={<Alerts />} />
            <Route path="configuration" element={<Settings />} />
            <Route path="compte" element={<Account />} />
          </Route>
          
          {/* Routes protégées pour l'application principale */}
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Index />} />
            <Route path="sites" element={<Sites />} />
            <Route path="sites/detected" element={<DetectedSites />} />
            <Route path="sites/:siteId/equipment" element={<SiteEquipment />} />
            <Route path="equipements" element={<Equipment />} />
            <Route path="equipements/:id" element={<EquipmentDetail />} />
            <Route path="alertes" element={<Alerts />} />
            <Route path="configuration" element={<Settings />} />
            <Route path="compte" element={<Account />} />
          </Route>

          {/* Route pour gérer les URLs non trouvées */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
      <Toaster />
      <Sonner />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
