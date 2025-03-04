
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
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });
  
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
    }
  }, [apiKey]);
  
  const simulatePersonaResponse = async (userMessage: string) => {
    setIsGenerating(true);
    
    if (!apiKey) {
      toast.error("Please enter your Gemini API key in the settings.");
      setIsGenerating(false);
      setShowSettings(true);
      return;
    }
    
    const newPersonaMessage = await generatePersonaResponse(
      apiKey,
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

  return (
    <div className="h-full flex flex-col rounded-lg overflow-hidden bg-secondary/50">
      <ChatHeader 
        persona={persona}
        onToggleSettings={() => setShowSettings(!showSettings)}
        onResetConversation={handleResetConversation}
        onSaveConversation={handleSaveConversation}
      />
      
      <AnimatePresence>
        <ChatSettings 
          isVisible={showSettings}
          conversationName={conversationName}
          apiKey={apiKey}
          onConversationNameChange={setConversationName}
          onApiKeyChange={setApiKey}
        />
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
