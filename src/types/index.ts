export interface Persona {
  id: string;
  name: string;
  avatar: string;
  tagline: string;
  background: string;
  traits: PersonaTraits;
  dataSources: DataSource[];
  geminiApiKey?: string; // Add optional Gemini API key field
  createdAt: string;
  updatedAt: string;
}

export interface PersonaTraits {
  personality: string[];
  interests: string[];
  communication: string;
  values: string[];
  behaviors: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface DataSource {
  type: 'social' | 'professional' | 'behavioral' | 'custom';
  name: string;
  description: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'persona';
  personaId?: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  personaId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}
