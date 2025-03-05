import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { nanoid } from 'nanoid';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Github, 
  Plus, 
  X, 
  Save,
  Users,
  AlertTriangle,
  Key
} from "lucide-react";
import type { Persona, DataSource, PersonaTraits } from '@/types';
import { toast } from 'sonner';

interface CreatePersonaFormProps {
  initialData?: Persona;
  onSave?: (persona: Persona) => void;
}

const DEFAULT_TRAITS: PersonaTraits = {
  personality: [],
  interests: [],
  communication: 'balanced',
  values: [],
  behaviors: [],
  strengths: [],
  weaknesses: []
};

const DEFAULT_DATA_SOURCES: DataSource[] = [];

const CreatePersonaForm = ({ initialData, onSave }: CreatePersonaFormProps) => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('basic');
  const [formData, setFormData] = useState<Partial<Persona>>(
    initialData || {
      id: nanoid(),
      name: '',
      avatar: '',
      tagline: '',
      background: '',
      traits: DEFAULT_TRAITS,
      dataSources: DEFAULT_DATA_SOURCES,
      geminiApiKey: localStorage.getItem('gemini_api_key') || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );
  
  const [currentTrait, setCurrentTrait] = useState('');
  const [currentInterest, setCurrentInterest] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [currentBehavior, setCurrentBehavior] = useState('');
  const [currentStrength, setCurrentStrength] = useState('');
  const [currentWeakness, setCurrentWeakness] = useState('');
  
  const setRandomAvatar = () => {
    const seed = Math.floor(Math.random() * 1000);
    setFormData({
      ...formData,
      avatar: `https://source.unsplash.com/300x300/?portrait,person&${seed}`
    });
  };
  
  const handleAddTrait = () => {
    if (!currentTrait.trim()) return;
    setFormData({
      ...formData,
      traits: {
        ...formData.traits as PersonaTraits,
        personality: [
          ...(formData.traits as PersonaTraits).personality,
          currentTrait.trim()
        ]
      }
    });
    setCurrentTrait('');
  };
  
  const handleRemoveTrait = (index: number) => {
    const newTraits = [...(formData.traits as PersonaTraits).personality];
    newTraits.splice(index, 1);
    setFormData({
      ...formData,
      traits: {
        ...formData.traits as PersonaTraits,
        personality: newTraits
      }
    });
  };
  
  const handleAddInterest = () => {
    if (!currentInterest.trim()) return;
    setFormData({
      ...formData,
      traits: {
        ...formData.traits as PersonaTraits,
        interests: [
          ...(formData.traits as PersonaTraits).interests,
          currentInterest.trim()
        ]
      }
    });
    setCurrentInterest('');
  };
  
  const handleRemoveInterest = (index: number) => {
    const newInterests = [...(formData.traits as PersonaTraits).interests];
    newInterests.splice(index, 1);
    setFormData({
      ...formData,
      traits: {
        ...formData.traits as PersonaTraits,
        interests: newInterests
      }
    });
  };
  
  const handleAddValue = () => {
    if (!currentValue.trim()) return;
    setFormData({
      ...formData,
      traits: {
        ...formData.traits as PersonaTraits,
        values: [
          ...(formData.traits as PersonaTraits).values,
          currentValue.trim()
        ]
      }
    });
    setCurrentValue('');
  };
  
  const handleRemoveValue = (index: number) => {
    const newValues = [...(formData.traits as PersonaTraits).values];
    newValues.splice(index, 1);
    setFormData({
      ...formData,
      traits: {
        ...formData.traits as PersonaTraits,
        values: newValues
      }
    });
  };
  
  const handleAddBehavior = () => {
    if (!currentBehavior.trim()) return;
    setFormData({
      ...formData,
      traits: {
        ...formData.traits as PersonaTraits,
        behaviors: [
          ...(formData.traits as PersonaTraits).behaviors,
          currentBehavior.trim()
        ]
      }
    });
    setCurrentBehavior('');
  };
  
  const handleRemoveBehavior = (index: number) => {
    const newBehaviors = [...(formData.traits as PersonaTraits).behaviors];
    newBehaviors.splice(index, 1);
    setFormData({
      ...formData,
      traits: {
        ...formData.traits as PersonaTraits,
        behaviors: newBehaviors
      }
    });
  };
  
  const handleAddStrength = () => {
    if (!currentStrength.trim()) return;
    setFormData({
      ...formData,
      traits: {
        ...formData.traits as PersonaTraits,
        strengths: [
          ...(formData.traits as PersonaTraits).strengths,
          currentStrength.trim()
        ]
      }
    });
    setCurrentStrength('');
  };
  
  const handleRemoveStrength = (index: number) => {
    const newStrengths = [...(formData.traits as PersonaTraits).strengths];
    newStrengths.splice(index, 1);
    setFormData({
      ...formData,
      traits: {
        ...formData.traits as PersonaTraits,
        strengths: newStrengths
      }
    });
  };
  
  const handleAddWeakness = () => {
    if (!currentWeakness.trim()) return;
    setFormData({
      ...formData,
      traits: {
        ...formData.traits as PersonaTraits,
        weaknesses: [
          ...(formData.traits as PersonaTraits).weaknesses,
          currentWeakness.trim()
        ]
      }
    });
    setCurrentWeakness('');
  };
  
  const handleRemoveWeakness = (index: number) => {
    const newWeaknesses = [...(formData.traits as PersonaTraits).weaknesses];
    newWeaknesses.splice(index, 1);
    setFormData({
      ...formData,
      traits: {
        ...formData.traits as PersonaTraits,
        weaknesses: newWeaknesses
      }
    });
  };
  
  const handleAddDataSource = (type: DataSource['type'], name: string, description: string) => {
    const newDataSource: DataSource = {
      type,
      name,
      description
    };
    
    setFormData({
      ...formData,
      dataSources: [...(formData.dataSources || []), newDataSource]
    });
  };
  
  const handleSave = () => {
    if (!formData.name) {
      toast.error('Please enter a name for your persona');
      return;
    }
    
    if (formData.geminiApiKey) {
      localStorage.setItem('gemini_api_key', formData.geminiApiKey);
    }
    
    const finalPersona: Persona = {
      ...(formData as Persona),
      updatedAt: new Date().toISOString()
    };
    
    if (onSave) {
      onSave(finalPersona);
    } else {
      const existingPersonas = JSON.parse(localStorage.getItem('personas') || '[]');
      const updatedPersonas = initialData 
        ? existingPersonas.map((p: Persona) => p.id === finalPersona.id ? finalPersona : p)
        : [...existingPersonas, finalPersona];
      
      localStorage.setItem('personas', JSON.stringify(updatedPersonas));
      
      toast.success(initialData ? 'Persona updated successfully' : 'Persona created successfully');
      navigate('/library');
    }
  };
  
  const socialPlatforms = [
    { name: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
    { name: 'Twitter', icon: <Twitter className="h-4 w-4" /> },
    { name: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
    { name: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
    { name: 'GitHub', icon: <Github className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="traits">Traits & Behavior</TabsTrigger>
            <TabsTrigger value="data">Data Sources</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 space-y-4">
            <TabsContent value="basic" className="space-y-6 animate-slide-up">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input 
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tagline</label>
                    <Input 
                      placeholder="Tech enthusiast & marketing professional" 
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Background</label>
                    <Textarea 
                      placeholder="Brief description of the persona's background and history" 
                      rows={5}
                      value={formData.background}
                      onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gemini API Key</label>
                    <div className="flex space-x-2">
                      <Input
                        type="password"
                        value={formData.geminiApiKey || ''}
                        onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Get your API key from Google AI Studio. Your key is stored with this persona.
                    </p>
                    <div className="flex items-center p-2 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 text-sm mt-2">
                      <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                      <p>This integrates with Google's Gemini API to simulate realistic persona responses.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Avatar</label>
                    <div className="relative aspect-square rounded-lg overflow-hidden border border-border bg-secondary/50">
                      {formData.avatar ? (
                        <img 
                          src={formData.avatar} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                          No avatar selected
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setFormData({ ...formData, avatar: '' })}
                      >
                        Clear
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="w-full"
                        onClick={setRandomAvatar}
                      >
                        Random
                      </Button>
                    </div>
                    <Input 
                      placeholder="Avatar URL" 
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="traits" className="space-y-6 animate-slide-up">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Personality Traits</label>
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Add a personality trait" 
                          value={currentTrait}
                          onChange={(e) => setCurrentTrait(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTrait()}
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={handleAddTrait}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(formData.traits as PersonaTraits).personality.map((trait, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className="flex items-center gap-1 py-1"
                          >
                            {trait}
                            <button 
                              className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => handleRemoveTrait(index)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {(formData.traits as PersonaTraits).personality.length === 0 && (
                          <span className="text-sm text-muted-foreground">No traits added</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Interests</label>
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Add an interest" 
                          value={currentInterest}
                          onChange={(e) => setCurrentInterest(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={handleAddInterest}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(formData.traits as PersonaTraits).interests.map((interest, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className="flex items-center gap-1 py-1"
                          >
                            {interest}
                            <button 
                              className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => handleRemoveInterest(index)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {(formData.traits as PersonaTraits).interests.length === 0 && (
                          <span className="text-sm text-muted-foreground">No interests added</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Values</label>
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Add a value" 
                          value={currentValue}
                          onChange={(e) => setCurrentValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddValue()}
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={handleAddValue}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(formData.traits as PersonaTraits).values.map((value, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className="flex items-center gap-1 py-1"
                          >
                            {value}
                            <button 
                              className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => handleRemoveValue(index)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {(formData.traits as PersonaTraits).values.length === 0 && (
                          <span className="text-sm text-muted-foreground">No values added</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Behaviors</label>
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Add a behavior" 
                          value={currentBehavior}
                          onChange={(e) => setCurrentBehavior(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddBehavior()}
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={handleAddBehavior}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(formData.traits as PersonaTraits).behaviors.map((behavior, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className="flex items-center gap-1 py-1"
                          >
                            {behavior}
                            <button 
                              className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => handleRemoveBehavior(index)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {(formData.traits as PersonaTraits).behaviors.length === 0 && (
                          <span className="text-sm text-muted-foreground">No behaviors added</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Strengths</label>
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Add a strength" 
                          value={currentStrength}
                          onChange={(e) => setCurrentStrength(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddStrength()}
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={handleAddStrength}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(formData.traits as PersonaTraits).strengths.map((strength, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className="flex items-center gap-1 py-1"
                          >
                            {strength}
                            <button 
                              className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => handleRemoveStrength(index)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {(formData.traits as PersonaTraits).strengths.length === 0 && (
                          <span className="text-sm text-muted-foreground">No strengths added</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Weaknesses</label>
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Add a weakness" 
                          value={currentWeakness}
                          onChange={(e) => setCurrentWeakness(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddWeakness()}
                        />
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={handleAddWeakness}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(formData.traits as PersonaTraits).weaknesses.map((weakness, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className="flex items-center gap-1 py-1"
                          >
                            {weakness}
                            <button 
                              className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => handleRemoveWeakness(index)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {(formData.traits as PersonaTraits).weaknesses.length === 0 && (
                          <span className="text-sm text-muted-foreground">No weaknesses added</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="data" className="space-y-6 animate-slide-up">
              <div className="grid md:grid-cols-3 gap-4">
                {socialPlatforms.map((platform) => (
                  <Button
                    key={platform.name}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
                    onClick={() => handleAddDataSource(
                      'social', 
                      platform.name, 
                      `Data extracted from ${platform.name} profile`
                    )}
                  >
                    {platform.icon}
                    <span className="text-xs font-normal">{platform.name}</span>
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
                  onClick={() => handleAddDataSource(
                    'professional', 
                    'Company Data', 
                    'Professional data extracted from company sources'
                  )}
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="text-xs font-normal">Company Data</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
                  onClick={() => handleAddDataSource(
                    'behavioral', 
                    'Behavioral Analysis', 
                    'Data extracted from behavioral patterns and interactions'
                  )}
                >
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-normal">Behavioral</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
                  onClick={() => handleAddDataSource(
                    'custom', 
                    'Custom Source', 
                    'Manually entered custom data'
                  )}
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-xs font-normal">Custom</span>
                </Button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Added Data Sources</h3>
                <div className="space-y-2">
                  {(formData.dataSources || []).length > 0 ? (
                    (formData.dataSources || []).map((source, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-3 flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">{source.name}</h4>
                            <p className="text-xs text-muted-foreground">{source.description}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              const newSources = [...(formData.dataSources || [])];
                              newSources.splice(index, 1);
                              setFormData({
                                ...formData,
                                dataSources: newSources
                              });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-md">
                      No data sources added yet. Click on the options above to add data sources.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      <div className="flex justify-end pt-6 border-t border-border">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/library')}
          >
            Cancel
          </Button>
          <Button 
            variant="default" 
            className="gap-2"
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
            Save Persona
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePersonaForm;
