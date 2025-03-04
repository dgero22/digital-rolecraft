
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, RefreshCw, Save } from "lucide-react";
import type { Persona } from '@/types';

interface ChatHeaderProps {
  persona: Persona;
  onToggleSettings: () => void;
  onResetConversation: () => void;
  onSaveConversation: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  persona,
  onToggleSettings,
  onResetConversation,
  onSaveConversation
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={persona.avatar} alt={persona.name} />
          <AvatarFallback>{getInitials(persona.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{persona.name}</h3>
          <p className="text-xs text-muted-foreground">{persona.tagline}</p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleSettings}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onResetConversation}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onSaveConversation}
        >
          <Save className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
