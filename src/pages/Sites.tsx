
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, RefreshCcw, ArrowRight, Trash2Icon, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSites, createSite, updateSite, deleteSite } from "@/lib/api";
import { Site } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Sites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewSiteDialogOpen, setIsNewSiteDialogOpen] = useState(false);
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteAddress, setNewSiteAddress] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sites = [], isLoading, refetch } = useQuery({
    queryKey: ['sites'],
    queryFn: getSites,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Erreur",
          description: "Impossible de charger les sites. Veuillez réessayer.",
          variant: "destructive",
        });
        console.error("Error fetching sites:", error);
      },
    },
  });

  const createSiteMutation = useMutation({
    mutationFn: createSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast({
        title: "Succès",
        description: "Le site a été créé avec succès.",
      });
      setIsNewSiteDialogOpen(false);
      setNewSiteName("");
      setNewSiteAddress("");
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le site. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error("Error creating site:", error);
    },
  });

  const deleteSiteMutation = useMutation({
    mutationFn: deleteSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast({
        title: "Succès",
        description: "Le site a été supprimé avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le site. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error("Error deleting site:", error);
    },
  });

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName || !newSiteAddress) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    createSiteMutation.mutate({
      name: newSiteName,
      address: newSiteAddress,
      status: 'online'
    });
  };

  const handleDeleteSite = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce site ?")) {
      deleteSiteMutation.mutate(id);
    }
  };

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || site.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sites clients</h1>
          <p className="text-muted-foreground">
            Gestion et surveillance des sites
          </p>
        </div>
        <Dialog open={isNewSiteDialogOpen} onOpenChange={setIsNewSiteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0e3175] hover:bg-[#0e3175]/90">
              <PlusCircle className="w-4 h-4 mr-2" />
              Nouveau site
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau site</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du site</Label>
                <Input
                  id="name"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  placeholder="Entrez le nom du site"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={newSiteAddress}
                  onChange={(e) => setNewSiteAddress(e.target.value)}
                  placeholder="Entrez l'adresse du site"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewSiteDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={createSiteMutation.isPending}
                >
                  {createSiteMutation.isPending ? "Création..." : "Créer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Rechercher un site..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="pl-9 min-w-[180px]">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="online">En ligne</SelectItem>
              <SelectItem value="offline">Hors ligne</SelectItem>
              <SelectItem value="warning">Attention</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="ml-auto"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
        </Button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <Card className="p-4">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </Card>
        ) : filteredSites.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Aucun site trouvé</p>
          </Card>
        ) : (
          filteredSites.map((site) => (
            <Card key={site.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{site.name}</h3>
                  <p className="text-sm text-muted-foreground">{site.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    site.status === 'online' && "bg-green-100 text-green-800",
                    site.status === 'offline' && "bg-red-100 text-red-800",
                    site.status === 'warning' && "bg-yellow-100 text-yellow-800"
                  )}>
                    {site.status === 'online' && "En ligne"}
                    {site.status === 'offline' && "Hors ligne"}
                    {site.status === 'warning' && "Attention"}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/sites/${site.id}/equipment`}>
                      <Button variant="ghost" size="icon">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteSite(site.id)}
                      disabled={deleteSiteMutation.isPending}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Sites;
