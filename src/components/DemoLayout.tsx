
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const DemoLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    const path = pathname.replace('/demo/', '');
    switch (path) {
      case 'dashboard':
        return 'Tableau de bord';
      case 'sites':
        return 'Sites clients';
      case 'equipements':
        return 'Équipements';
      case 'alertes':
        return 'Alertes';
      case 'configuration':
        return 'Configuration';
      case 'compte':
        return 'Compte';
      default:
        return 'Tableau de bord';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} onCollapse={setIsCollapsed} />
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        isCollapsed ? "ml-20" : "ml-64"
      )}>
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <Alert variant="warning" className="m-2 border-yellow-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Mode démo pour les développeurs backend - Les données affichées sont factices
            </AlertDescription>
          </Alert>
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {getPageTitle(location.pathname)}
            </h1>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DemoLayout;
