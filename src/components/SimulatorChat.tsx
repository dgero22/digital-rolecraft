
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, RefreshCw, Settings, Save, AlertTriangle, Key } from "lucide-react";
import { nanoid } from 'nanoid';
import type { Persona, Message, Conversation } from '@/types';
import { toast } from 'sonner';
import { generateGeminiResponse } from '@/utils/geminiApi';

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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
    }
  }, [apiKey]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const simulatePersonaResponse = async (userMessage: string) => {
    setIsGenerating(true);
    
    if (!apiKey) {
      toast.error("Please enter your Gemini API key in the settings.");
      setIsGenerating(false);
      setShowSettings(true);
      return;
    }
    
    // Convert messages to the format expected by the Gemini API
    const messageHistory = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model' as 'user' | 'model',
      content: msg.content
    }));
    
    // Create a persona description for the API
    const personaDescription = `${persona.name}: ${persona.tagline}. 
      Background: ${persona.background}. 
      Personality: ${persona.traits.personality.join(', ')}. 
      Values: ${persona.traits.values.join(', ')}. 
      Communication style: ${persona.traits.communication}. 
      Interests: ${persona.traits.interests.join(', ')}. 
      Behaviors: ${persona.traits.behaviors.join(', ')}. 
      Strengths: ${persona.traits.strengths.join(', ')}. 
      Weaknesses: ${persona.traits.weaknesses.join(', ')}.`;
    
    try {
      const response = await generateGeminiResponse(
        apiKey,
        userMessage,
        personaDescription,
        messageHistory
      );
      
      if (response.error) {
        toast.error(`API Error: ${response.error}`);
      }
      
      const newMessage: Message = {
        id: nanoid(),
        content: response.text,
        sender: 'persona',
        personaId: persona.id,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Failed to generate a response. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: nanoid(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    simulatePersonaResponse(inputValue);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
    
    // Save to local storage
    const existingConversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    
    if (initialConversation) {
      // Update existing conversation
      const updatedConversations = existingConversations.map((c: Conversation) => 
        c.id === conversation.id ? conversation : c
      );
      localStorage.setItem('conversations', JSON.stringify(updatedConversations));
    } else {
      // Add new conversation
      localStorage.setItem('conversations', JSON.stringify([...existingConversations, conversation]));
    }
    
    toast.success("Conversation saved");
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="h-full flex flex-col rounded-lg overflow-hidden bg-secondary/50">
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
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetConversation}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveConversation}
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {showSettings && (
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
                  onChange={(e) => setConversationName(e.target.value)}
                  placeholder="Enter conversation name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Gemini API Key</label>
                <div className="flex space-x-2">
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
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
        )}
      </AnimatePresence>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Start a conversation</h3>
            <p className="text-muted-foreground max-w-md mt-2">
              Send a message to start chatting with {persona.name}. Responses are generated by Gemini-1.5-flash based on the persona's traits.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
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
                {message.sender === 'persona' && (
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
          ))
        )}
        {isGenerating && (
          <div className="flex justify-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card border rounded-lg p-3 max-w-[80%]"
            >
              <div className="flex items-center space-x-2 mb-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={persona.avatar} alt={persona.name} />
                  <AvatarFallback className="text-xs">{getInitials(persona.name)}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{persona.name}</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-foreground/30 animate-pulse-subtle" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-foreground/30 animate-pulse-subtle" style={{ animationDelay: '300ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-foreground/30 animate-pulse-subtle" style={{ animationDelay: '600ms' }}></div>
              </div>
            </motion.div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${persona.name}...`}
            className="min-h-12 max-h-32 resize-none"
            disabled={isGenerating}
          />
          <Button
            className="flex-shrink-0"
            size="icon"
            disabled={isGenerating || !inputValue.trim()}
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SimulatorChat;
