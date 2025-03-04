
import React from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Key } from "lucide-react";

interface ChatSettingsProps {
  isVisible: boolean;
  conversationName: string;
  apiKey: string;
  onConversationNameChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
}

const ChatSettings: React.FC<ChatSettingsProps> = ({
  isVisible,
  conversationName,
  apiKey,
  onConversationNameChange,
  onApiKeyChange
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="border-b overflow-hidden"
    >
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Conversation Name</label>
          <Input
            value={conversationName}
            onChange={(e) => onConversationNameChange(e.target.value)}
            placeholder="Enter conversation name"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Gemini API Key</label>
          <div className="flex space-x-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                window.open('https://makersuite.google.com/app/apikey', '_blank');
              }}
            >
              <Key className="h-4 w-4 mr-2" />
              Get Key
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your API key from Google AI Studio. Your key is stored only in your browser's local storage.
          </p>
        </div>
        
        <div className="flex items-center p-2 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 text-sm">
          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
          <p>This integrates with Google's Gemini API to generate responses based on the persona's traits.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatSettings;
