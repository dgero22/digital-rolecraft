
import React from 'react';
import { Settings, Undo, Save, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import type { Persona } from '@/types';

interface ChatHeaderProps {
  persona: Persona;
  isGroup?: boolean;
  participantCount?: number;
  onToggleSettings: () => void;
  onResetConversation: () => void;
  onSaveConversation: () => void;
  title?: string;
  extraActions?: React.ReactNode;
}

const ChatHeader = ({
  persona,
  isGroup = false,
  participantCount = 0,
  onToggleSettings,
  onResetConversation,
  onSaveConversation,
  title,
  extraActions
}: ChatHeaderProps) => {
  return (
    <header className="flex items-center justify-between p-3 border-b border-border bg-card/50">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 border border-border">
          <AvatarImage src={persona.avatar} alt={persona.name} />
          <AvatarFallback>
            {isGroup ? (
              <Users className="h-4 w-4" />
            ) : (
              persona.name?.charAt(0) || '?'
            )}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="font-medium text-sm leading-tight">
            {isGroup ? title || 'Group Chat' : persona.name}
          </h3>
          <p className="text-xs text-muted-foreground leading-tight">
            {isGroup ? `${participantCount} participants` : persona.tagline}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5">
        {extraActions}
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onSaveConversation}
          title="Save conversation"
        >
          <Save className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onResetConversation}
          title="Reset conversation"
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 mx-1" />
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleSettings}
          title="Chat settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
