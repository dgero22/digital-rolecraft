
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { generateGeminiResponse } from '@/utils/geminiApi';
import type { Message, Persona, Conversation } from '@/types';

export const createUserMessage = (content: string): Message => ({
  id: nanoid(),
  content,
  sender: 'user',
  timestamp: new Date().toISOString()
});

export const saveConversation = (
  conversation: Conversation,
  initialConversation?: Conversation
): void => {
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

export const generatePersonaResponse = async (
  apiKey: string,
  userMessage: string,
  persona: Persona,
  messageHistory: Message[]
): Promise<Message | null> => {
  if (!apiKey) {
    toast.error("Please enter your Gemini API key in the settings.");
    return null;
  }
  
  // Convert messages to the format expected by the Gemini API
  const historyForApi = messageHistory.map(msg => ({
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
      historyForApi
    );
    
    if (response.error) {
      toast.error(`API Error: ${response.error}`);
      return null;
    }
    
    return {
      id: nanoid(),
      content: response.text,
      sender: 'persona',
      personaId: persona.id,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error generating response:", error);
    toast.error("Failed to generate a response. Please try again.");
    return null;
  }
};
