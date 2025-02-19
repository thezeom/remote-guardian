
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AgentSetup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [siteName, setSiteName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. S'authentifier ou créer un compte
      const authResponse = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authResponse.error) {
        // Si la connexion échoue, essayer de créer un compte
        const signUpResponse = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpResponse.error) {
          throw signUpResponse.error;
        }
      }

      // 2. Créer le site avec le statut "pending"
      const { error: siteError } = await supabase
        .from('sites')
        .insert([
          {
            name: siteName,
            address: "À configurer",
            status: "pending"
          }
        ]);

      if (siteError) throw siteError;

      toast({
        title: "Configuration réussie",
        description: "Votre site a été enregistré. Vous allez être redirigé.",
      });

      // 3. Rediriger vers le dashboard
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Wifi className="w-6 h-6 text-[#0e3175]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Configuration de l'agent</h1>
          <p className="text-gray-500 text-sm">
            Connectez-vous ou créez un compte pour enregistrer votre site
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteName">Nom du site</Label>
            <Input
              id="siteName"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Mon site"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#0e3175] hover:bg-[#0e3175]/90"
            disabled={isLoading}
          >
            {isLoading ? "Configuration..." : "Configurer l'agent"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AgentSetup;
