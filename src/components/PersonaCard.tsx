
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Edit, Clock } from "lucide-react";
import type { Persona } from '@/types';

interface PersonaCardProps {
  persona: Persona;
}

const PersonaCard = ({ persona }: PersonaCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="h-full overflow-hidden glass-card border transition-all duration-300 hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"
            aria-hidden="true"
          />
          <img 
            src={persona.avatar || 'https://source.unsplash.com/random/?portrait'} 
            alt={persona.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {persona.traits.personality.slice(0, 2).map((trait, index) => (
              <Badge key={index} variant="secondary" className="bg-black/60 text-white border-none text-xs">
                {trait}
              </Badge>
            ))}
          </div>
        </div>
        
        <CardContent className="p-5 space-y-4">
          <div>
            <h3 className="font-medium text-lg tracking-tight line-clamp-1">{persona.name}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{persona.tagline}</p>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>Created {formatDate(persona.createdAt)}</span>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Button asChild size="sm" variant="outline" className="h-8">
              <Link to={`/simulator?personaId=${persona.id}`}>
                <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                Simulate
              </Link>
            </Button>
            
            <Button asChild size="sm" variant="ghost" className="h-8">
              <Link to={`/create?edit=${persona.id}`}>
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PersonaCard;
