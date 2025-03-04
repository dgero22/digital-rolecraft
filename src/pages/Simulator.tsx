
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import SimulatorChat from "@/components/SimulatorChat";
import { ArrowLeft, Users } from "lucide-react";
import type { Persona, Conversation } from '@/types';

const Simulator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load personas from localStorage
    const storedPersonas = JSON.parse(localStorage.getItem('personas') || '[]');
    setPersonas(storedPersonas);
    
    // Load conversations from localStorage
    const storedConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    setConversations(storedConversations);
    
    // Get persona ID from URL if present
    const searchParams = new URLSearchParams(location.search);
    const personaId = searchParams.get('personaId');
    const conversationId = searchParams.get('conversationId');
    
    if (personaId && storedPersonas.some((p: Persona) => p.id === personaId)) {
      setSelectedPersonaId(personaId);
      
      // If conversation ID is provided and valid, select it
      if (conversationId) {
        const conversation = storedConversations.find(
          (c: Conversation) => c.id === conversationId && c.personaId === personaId
        );
        
        if (conversation) {
          setSelectedConversationId(conversationId);
        }
      }
    } else if (storedPersonas.length > 0) {
      setSelectedPersonaId(storedPersonas[0].id);
    }
    
    setIsLoading(false);
  }, [location.search]);
  
  const selectedPersona = personas.find(p => p.id === selectedPersonaId);
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  
  const personaConversations = conversations.filter(
    c => c.personaId === selectedPersonaId
  );
  
  const handlePersonaChange = (personaId: string) => {
    setSelectedPersonaId(personaId);
    setSelectedConversationId(null);
    navigate(`/simulator?personaId=${personaId}`);
  };
  
  const handleConversationChange = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    navigate(`/simulator?personaId=${selectedPersonaId}&conversationId=${conversationId}`);
  };

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
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => navigate('/library')}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h1 className="text-2xl md:text-3xl font-semibold">Conversation Simulator</h1>
                </div>
                <p className="text-muted-foreground mt-1 md:ml-10">
                  Simulate conversations with your digital personas
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Select 
                  value={selectedPersonaId || ''} 
                  onValueChange={handlePersonaChange}
                  disabled={personas.length === 0}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select a persona" />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map(persona => (
                      <SelectItem key={persona.id} value={persona.id}>
                        {persona.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={selectedConversationId || 'new'} 
                  onValueChange={handleConversationChange}
                  disabled={personaConversations.length === 0}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select conversation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New conversation</SelectItem>
                    {personaConversations.map(conversation => (
                      <SelectItem key={conversation.id} value={conversation.id}>
                        {new Date(conversation.createdAt).toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="h-[600px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : personas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-secondary/50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-medium mb-2">No personas yet</h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Create a digital persona first before starting a simulation.
                </p>
                <Button onClick={() => navigate('/create')}>
                  Create Your First Persona
                </Button>
              </div>
            ) : selectedPersona ? (
              <div className="h-[600px] rounded-lg overflow-hidden border">
                <SimulatorChat
                  persona={selectedPersona}
                  initialConversation={selectedConversation}
                />
              </div>
            ) : (
              <div className="h-[600px] flex items-center justify-center bg-secondary/50 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-medium mb-2">Select a persona</h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Choose a persona from the dropdown to start a conversation.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Simulator;
