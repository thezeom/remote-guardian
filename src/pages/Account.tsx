
import { Card } from "@/components/ui/card";
import { UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+33 6 12 34 56 78",
    role: "Administrateur",
    timezone: "Europe/Paris",
    language: "fr",
    lastLogin: new Date().toLocaleString()
  });

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSave = () => {
    toast.success("Modifications enregistrées avec succès");
  };

  const handleLogout = async () => {
    try {
      logout();
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Compte</h1>
          <p className="text-muted-foreground">
            Gestion de votre compte
          </p>
        </div>
        <Button onClick={handleSave}>Enregistrer les modifications</Button>
      </div>

      <div className="grid gap-4">
        <Card className="p-6 glass">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 rounded-lg bg-secondary flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Global Secure SARL</h2>
                <p className="text-muted-foreground">Configuration de l'entreprise</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </Button>
          </div>
        </Card>

        <Card className="p-6 glass">
          <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name" 
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  value={user.phone}
                  onChange={(e) => setUser({...user, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Input id="role" value={user.role} disabled />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass">
          <h2 className="text-lg font-semibold mb-4">Préférences</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select 
                value={user.language}
                onValueChange={(value) => setUser({...user, language: value})}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Sélectionner une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select 
                value={user.timezone}
                onValueChange={(value) => setUser({...user, timezone: value})}
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Sélectionner un fuseau horaire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6 glass">
          <h2 className="text-lg font-semibold mb-4">Dernière connexion</h2>
          <p className="font-medium">{user.lastLogin}</p>
        </Card>
      </div>
    </div>
  );
};

export default Account;
