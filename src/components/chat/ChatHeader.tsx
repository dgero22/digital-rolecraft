
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, RefreshCw, Save, Users } from "lucide-react";
import type { Persona } from '@/types';

interface ChatHeaderProps {
  persona: Persona;
  isGroup?: boolean;
  participantCount?: number;
  title?: string;
  onToggleSettings: () => void;
  onResetConversation: () => void;
  onSaveConversation: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  persona,
  isGroup = false,
  participantCount = 0,
  title,
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
        {isGroup ? (
          <div className="relative">
            <Avatar className="h-10 w-10 bg-primary/10">
              <AvatarFallback className="bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-background text-xs rounded-full px-1 font-medium border">
              {participantCount}
            </div>
          </div>
        ) : (
          <Avatar>
            <AvatarImage src={persona.avatar} alt={persona.name} />
            <AvatarFallback>{getInitials(persona.name)}</AvatarFallback>
          </Avatar>
        )}
        
        <div>
          <h3 className="font-medium">{isGroup ? title || 'Group Conversation' : persona.name}</h3>
          <p className="text-xs text-muted-foreground">
            {isGroup ? 'Multiple personas' : persona.tagline}
          </p>
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
