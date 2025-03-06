
import React from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Persona } from '@/types';

interface GroupChatSettingsProps {
  isVisible: boolean;
  conversationTitle: string;
  onConversationTitleChange: (value: string) => void;
  availablePersonas: Persona[];
  selectedPersonas: Persona[];
  onAddPersona: (personaId: string) => void;
  onRemovePersona: (personaId: string) => void;
}

const GroupChatSettings: React.FC<GroupChatSettingsProps> = ({
  isVisible,
  conversationTitle,
  onConversationTitleChange,
  availablePersonas,
  selectedPersonas,
  onAddPersona,
  onRemovePersona
}) => {
  const [selectValue, setSelectValue] = React.useState('');
  
  const filteredPersonas = availablePersonas.filter(
    persona => !selectedPersonas.some(selected => selected.id === persona.id)
  );
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Removed conditional return so the component always renders with animation
  
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: isVisible ? 'auto' : 0, opacity: isVisible ? 1 : 0 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="border-b overflow-hidden relative z-10 bg-secondary/90 backdrop-blur-sm"
      style={{ display: 'block' }} // Ensure the div is always in the DOM
    >
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Conversation Title</label>
          <Input
            value={conversationTitle}
            onChange={(e) => onConversationTitleChange(e.target.value)}
            placeholder="Enter conversation title"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Participants</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedPersonas.map(persona => (
              <div key={persona.id} className="flex items-center bg-secondary rounded-full pl-1 pr-2 py-1">
                <Avatar className="h-6 w-6 mr-1">
                  <AvatarImage src={persona.avatar} alt={persona.name} />
                  <AvatarFallback className="text-xs">{getInitials(persona.name)}</AvatarFallback>
                </Avatar>
                <span className="text-xs mr-1">{persona.name}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 rounded-full"
                  onClick={() => onRemovePersona(persona.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              disabled={filteredPersonas.length === 0}
            >
              <option value="">Select persona to add</option>
              {filteredPersonas.map(persona => (
                <option key={persona.id} value={persona.id}>
                  {persona.name}
                </option>
              ))}
            </select>
            <Button 
              className="flex-shrink-0"
              onClick={() => {
                if (selectValue) {
                  onAddPersona(selectValue);
                  setSelectValue('');
                }
              }}
              disabled={!selectValue}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GroupChatSettings;
