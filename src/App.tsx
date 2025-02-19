
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/AuthProvider";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Page d'accueil */}
          <Route path="/" element={<Landing />} />

          {/* Routes principales avec Layout */}
          <Route element={<Layout />}>
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

          {/* Page 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
