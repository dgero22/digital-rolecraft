
export interface Persona {
  id: string;
  name: string;
  avatar: string;
  tagline: string;
  background: string;
  traits: PersonaTraits;
  dataSources: DataSource[];
  geminiApiKey?: string;
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
  id?: string;
  type: 'social' | 'professional' | 'behavioral' | 'custom';
  name: string;
  description: string;
  url?: string;
  file?: string; // Path or reference to the file
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
  isGroup?: boolean;
  participantIds?: string[]; // Array of persona IDs for group conversations
  messages: Message[];
  title?: string; // Title for the conversation, especially useful for group chats
  createdAt: string;
  updatedAt: string;
}

// New Organization Chart interfaces
export interface OrgChart {
  id: string;
  name: string;
  nodes: OrgChartNode[];
  edges: OrgChartEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface OrgChartNode {
  id: string;
  type: string;
  personaId?: string; // Reference to a persona
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    role?: string;
    department?: string;
    onEdit?: (personaId?: string) => void;
    personaId?: string;
  };
}

export interface OrgChartEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  animated?: boolean;
  markerEnd?: any;
  data?: {
    relationshipType?: string;
    label?: string;
    onStartConversation?: (edgeId: string) => void;
    onDefineRelationship?: (edgeId: string, type: string) => void;
    onDeleteConnection?: (edgeId: string) => void;
  };
}
