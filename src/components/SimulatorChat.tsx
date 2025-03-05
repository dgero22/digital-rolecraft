
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Persona, Message, Conversation } from '@/types';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';

// Import refactored components
import ChatHeader from './chat/ChatHeader';
import ChatSettings from './chat/ChatSettings';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import { createUserMessage, saveConversation, generatePersonaResponse } from './chat/utils';

interface SimulatorChatProps {
  persona: Persona;
  initialConversation?: Conversation;
}

const SimulatorChat = ({ persona, initialConversation }: SimulatorChatProps) => {
  const [messages, setMessages] = useState<Message[]>(
    initialConversation?.messages || []
  );
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [conversationName, setConversationName] = useState(
    initialConversation?.id || `Conversation with ${persona.name}`
  );
  
  const simulatePersonaResponse = async (userMessage: string) => {
    setIsGenerating(true);
    
    if (!persona.geminiApiKey) {
      toast.error("This persona doesn't have a Gemini API key. Please edit the persona to add an API key.");
      setIsGenerating(false);
      return;
    }
    
    const newPersonaMessage = await generatePersonaResponse(
      persona.geminiApiKey,
      userMessage,
      persona,
      messages
    );
    
    if (newPersonaMessage) {
      setMessages(prev => [...prev, newPersonaMessage]);
    }
    
    setIsGenerating(false);
  };
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = createUserMessage(inputValue);
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    simulatePersonaResponse(inputValue);
  };
  
  const handleResetConversation = () => {
    setMessages([]);
    toast.success("Conversation reset");
  };
  
  const handleSaveConversation = () => {
    if (messages.length === 0) {
      toast.error("Can't save an empty conversation");
      return;
    }
    
    const conversation: Conversation = {
      id: initialConversation?.id || nanoid(),
      personaId: persona.id,
      messages,
      createdAt: initialConversation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveConversation(conversation, initialConversation);
  };

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };

  return (
    <div className="h-full flex flex-col rounded-lg overflow-hidden bg-secondary/50">
      <ChatHeader 
        persona={persona}
        onToggleSettings={toggleSettings}
        onResetConversation={handleResetConversation}
        onSaveConversation={handleSaveConversation}
      />
      
      <AnimatePresence>
        {showSettings && (
          <ChatSettings 
            isVisible={showSettings}
            conversationName={conversationName}
            onConversationNameChange={setConversationName}
          />
        )}
      </AnimatePresence>
      
      <MessageList 
        messages={messages}
        persona={persona}
        isGenerating={isGenerating}
      />
      
      <MessageInput 
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        isGenerating={isGenerating}
        persona={persona}
      />
    </div>
  );
};

export default SimulatorChat;
