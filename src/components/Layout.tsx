
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./Sidebar";
import { LogOut, UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "./AuthProvider";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors de la déconnexion.",
        variant: "destructive",
      });
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
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserIcon className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
