
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import CreatePersonaForm from "@/components/CreatePersonaForm";
import type { Persona } from '@/types';

const CreatePersona = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<Persona | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editId = searchParams.get('edit');
    
    if (editId) {
      // Get persona from localStorage
      const personas = JSON.parse(localStorage.getItem('personas') || '[]');
      const personaToEdit = personas.find((p: Persona) => p.id === editId);
      
      if (personaToEdit) {
        setInitialData(personaToEdit);
      } else {
        navigate('/create');
      }
    }
    
    setIsLoading(false);
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-semibold">
                  {initialData ? 'Edit Persona' : 'Create New Persona'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {initialData
                    ? `Update the details for ${initialData.name}`
                    : 'Fill in the details to create a new digital persona'}
                </p>
              </div>
              
              {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="bg-card rounded-lg border p-6">
                  <CreatePersonaForm initialData={initialData} />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CreatePersona;
