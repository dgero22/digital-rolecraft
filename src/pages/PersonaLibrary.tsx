
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import PersonaCard from "@/components/PersonaCard";
import { Plus, Search, Users, GitBranch } from "lucide-react";
import type { Persona } from '@/types';

const PersonaLibrary = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateDesc');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load personas from localStorage
    const storedPersonas = JSON.parse(localStorage.getItem('personas') || '[]');
    setPersonas(storedPersonas);
    setIsLoading(false);
  }, []);
  
  const filteredPersonas = personas.filter((persona) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      persona.name.toLowerCase().includes(searchTermLower) ||
      persona.tagline.toLowerCase().includes(searchTermLower) ||
      persona.traits.personality.some(trait => 
        trait.toLowerCase().includes(searchTermLower)
      ) ||
      persona.traits.interests.some(interest => 
        interest.toLowerCase().includes(searchTermLower)
      )
    );
  });
  
  const sortedPersonas = [...filteredPersonas].sort((a, b) => {
    switch (sortBy) {
      case 'dateDesc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'dateAsc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold">Persona Library</h1>
                <p className="text-muted-foreground mt-1">
                  Browse and manage your created digital personas
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link to="/create" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Persona
                  </Link>
                </Button>
                
                <Button variant="outline" asChild>
                  <Link to="/org-chart" className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Org Chart
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search personas..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dateDesc">Newest first</SelectItem>
                  <SelectItem value="dateAsc">Oldest first</SelectItem>
                  <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
                  <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : personas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-secondary/50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-medium mb-2">No personas yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Create your first digital persona to start building your library.
                </p>
                <Button asChild>
                  <Link to="/create" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Persona
                  </Link>
                </Button>
              </div>
            ) : sortedPersonas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-secondary/50 rounded-lg">
                <Search className="h-8 w-8 text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium mb-2">No results found</h2>
                <p className="text-muted-foreground mb-4 max-w-md">
                  No personas match your search criteria. Try a different search term.
                </p>
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPersonas.map((persona) => (
                  <PersonaCard key={persona.id} persona={persona} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PersonaLibrary;
