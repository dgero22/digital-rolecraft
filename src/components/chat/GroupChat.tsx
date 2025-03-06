
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Persona, Message, Conversation } from '@/types';

import ChatHeader from './ChatHeader';
import GroupChatSettings from './GroupChatSettings';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { createUserMessage, saveConversation, generatePersonaResponse } from './utils';

interface GroupChatProps {
  personas: Persona[];
  initialConversation?: Conversation;
  availablePersonas: Persona[];
}

const GroupChat = ({ personas, initialConversation, availablePersonas }: GroupChatProps) => {
  // Check if personas exist and if not, avoid rendering
  if (!personas || personas.length === 0) {
    return <div className="h-full flex items-center justify-center p-4">
      <p>Please select at least one persona to start a group chat</p>
    </div>;
  }
  
  const [messages, setMessages] = useState<Message[]>(
    initialConversation?.messages || []
  );
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [conversationTitle, setConversationTitle] = useState(
    initialConversation?.title || 'Group Conversation'
  );
  const [participants, setParticipants] = useState<Persona[]>(
    personas || []
  );
  
  // Choose a random persona to respond next
  const getRandomPersona = (excludeId?: string) => {
    const availablePersonas = excludeId 
      ? participants.filter(p => p.id !== excludeId)
      : participants;
    
    if (availablePersonas.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availablePersonas.length);
    return availablePersonas[randomIndex];
  };
  
  const simulateGroupInteraction = async (userMessage: string) => {
    setIsGenerating(true);
    
    // First, choose a random persona to respond to the user
    const respondingPersona = getRandomPersona();
    
    if (!respondingPersona || !respondingPersona.geminiApiKey) {
      toast.error("No persona with API key available to respond");
      setIsGenerating(false);
      return;
    }
    
    try {
      // Generate a response from the first persona
      const firstResponse = await generatePersonaResponse(
        respondingPersona.geminiApiKey,
        userMessage,
        respondingPersona,
        messages
      );
      
      if (firstResponse) {
        setMessages(prev => [...prev, firstResponse]);
        
        // After a short delay, maybe have another persona respond to the first persona
        if (participants.length > 1 && Math.random() > 0.3) {
          setTimeout(async () => {
            const secondPersona = getRandomPersona(respondingPersona.id);
            
            if (secondPersona && secondPersona.geminiApiKey) {
              const promptForSecond = `${respondingPersona.name} said: "${firstResponse.content}"`;
              
              const secondResponse = await generatePersonaResponse(
                secondPersona.geminiApiKey,
                promptForSecond,
                secondPersona,
                [...messages, firstResponse]
              );
              
              if (secondResponse) {
                setMessages(prev => [...prev, secondResponse]);
              }
            }
            setIsGenerating(false);
          }, 1500);
        } else {
          setIsGenerating(false);
        }
      } else {
        setIsGenerating(false);
      }
    } catch (error) {
      console.error("Error in group interaction:", error);
      toast.error("Something went wrong with the group interaction");
      setIsGenerating(false);
    }
  };
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage = createUserMessage(inputValue);
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    simulateGroupInteraction(inputValue);
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
      personaId: participants[0]?.id || '',
      isGroup: true,
      participantIds: participants.map(p => p.id),
      messages,
      title: conversationTitle,
      createdAt: initialConversation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    saveConversation(conversation, initialConversation);
  };
  
  const handleAddPersona = (personaId: string) => {
    const personaToAdd = availablePersonas.find(p => p.id === personaId);
    if (personaToAdd) {
      setParticipants(prev => [...prev, personaToAdd]);
    }
  };
  
  const handleRemovePersona = (personaId: string) => {
    setParticipants(prev => prev.filter(p => p.id !== personaId));
  };

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };

  const exportConversation = () => {
    if (messages.length === 0) {
      toast.error("No messages to export");
      return;
    }
    
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString();
    };
    
    let content = `# ${conversationTitle}\n`;
    content += `Exported on: ${new Date().toLocaleString()}\n\n`;
    
    messages.forEach(message => {
      const senderName = message.sender === 'user' 
        ? 'You' 
        : participants.find(p => p.id === message.personaId)?.name || 'Unknown';
      
      content += `[${formatDate(message.timestamp)}] ${senderName}:\n${message.content}\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversationTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
    toast.success("Conversation exported successfully");
  };

  return (
    <div className="h-full flex flex-col rounded-lg overflow-hidden bg-secondary/50">
      <ChatHeader 
        persona={participants[0] || {} as Persona}
        isGroup={true}
        participantCount={participants.length}
        onToggleSettings={toggleSettings}
        onResetConversation={handleResetConversation}
        onSaveConversation={handleSaveConversation}
        title={conversationTitle}
        extraActions={
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={exportConversation}
            title="Export conversation"
          >
            <Download className="h-4 w-4" />
          </Button>
        }
      />
      
      <div className="relative">
        <AnimatePresence>
          {showSettings && (
            <GroupChatSettings 
              isVisible={showSettings}
              conversationTitle={conversationTitle}
              onConversationTitleChange={setConversationTitle}
              availablePersonas={availablePersonas}
              selectedPersonas={participants}
              onAddPersona={handleAddPersona}
              onRemovePersona={handleRemovePersona}
            />
          )}
        </AnimatePresence>
      </div>
      
      <MessageList 
        messages={messages}
        personas={participants} 
        isGenerating={isGenerating}
      />
      
      <MessageInput 
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSendMessage={handleSendMessage}
        isGenerating={isGenerating}
        persona={participants[0] || {} as Persona}
      />
    </div>
  );
};

export default GroupChat;
