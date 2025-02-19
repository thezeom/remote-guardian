
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, RefreshCcw, ArrowRight, Trash2Icon, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getSites } from "@/lib/api";
import { Site } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

const Sites = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: sites = [], isLoading, refetch } = useQuery({
    queryKey: ['sites'],
    queryFn: getSites,
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de charger les sites. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error("Error fetching sites:", error);
    },
  });

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
        <Button className="bg-[#0e3175] hover:bg-[#0e3175]/90">
          <PlusCircle className="w-4 h-4 mr-2" />
          Nouveau site
        </Button>
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
                    "status-badge",
                    site.status === 'online' && "status-online",
                    site.status === 'offline' && "status-offline",
                    site.status === 'warning' && "status-warning"
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
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
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
