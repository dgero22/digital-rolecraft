
import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Message, Persona } from '@/types';

interface MessageItemProps {
  message: Message;
  persona?: Persona;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, persona }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`max-w-[80%] rounded-lg p-3 ${
          message.sender === 'user'
            ? 'bg-primary text-primary-foreground ml-8'
            : 'bg-card border ml-0 mr-8'
        }`}
      >
        {message.sender === 'persona' && persona && (
          <div className="flex items-center space-x-2 mb-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={persona.avatar} alt={persona.name} />
              <AvatarFallback className="text-xs">{getInitials(persona.name)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">{persona.name}</span>
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div className="mt-1 text-right">
          <span className="text-xs opacity-70">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default MessageItem;
