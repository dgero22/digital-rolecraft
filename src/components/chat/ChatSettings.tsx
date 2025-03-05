
import React from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";

interface ChatSettingsProps {
  isVisible: boolean;
  conversationName: string;
  onConversationNameChange: (value: string) => void;
}

const ChatSettings: React.FC<ChatSettingsProps> = ({
  isVisible,
  conversationName,
  onConversationNameChange
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
      </div>
    </motion.div>
  );
};

export default ChatSettings;
