import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Users, MessageCircle, Sparkles, ArrowRight, Plus } from "lucide-react";
const Index = () => {
  const navigate = useNavigate();
  const features = [{
    icon: <Users className="h-5 w-5" />,
    title: "Create Digital Personas",
    description: "Build detailed digital personas based on social media data, behavioral patterns, and professional information."
  }, {
    icon: <MessageCircle className="h-5 w-5" />,
    title: "Simulate Conversations",
    description: "Engage in realistic simulated conversations with your created personas to understand behavior and communication patterns."
  }, {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Personalized Insights",
    description: "Gain valuable insights into personality traits, interests, and communication styles through data-driven analysis."
  }];
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20 -z-10" />
          
          <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="max-w-3xl mx-auto">
              <span className="inline-block px-3 py-1 mb-6 text-xs font-medium rounded-full bg-primary/10 text-primary">
                Digital Persona Creation
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight md:leading-tight lg:leading-tight mb-6">
                Create and Simulate Digital Personas
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Build precise digital representations of individuals based on social data, company information, and behavior patterns.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2" onClick={() => navigate('/create')}>
                  <Plus className="h-4 w-4" />
                  Create Your First Persona
                </Button>
                
                <Button variant="outline" size="lg" className="gap-2" onClick={() => navigate('/library')}>
                  <Users className="h-4 w-4" />
                  Browse Personas
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-semibold mb-4">Powerful Features</h2>
              <p className="text-lg text-muted-foreground">
                Our platform provides everything you need to create detailed digital personas for role play, research, or user experience design.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4,
              delay: index * 0.1
            }} className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>)}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="glass-panel rounded-2xl p-8 md:p-12 max-w-5xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 -z-10" />
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                  <h2 className="text-3xl font-semibold mb-4">Ready to Create Your Digital Personas?</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Start building detailed digital representations today and gain valuable insights into behavior patterns and communication styles.
                  </p>
                  <Button size="lg" className="gap-2" onClick={() => navigate('/create')}>
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-40 h-40 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="h-20 w-20 text-primary/20" />
                    </div>
                    <div className="absolute inset-0 animate-pulse-subtle opacity-70">
                      <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{
                      animationDuration: '3s'
                    }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center">
                <Users className="h-3 w-3 text-white" />
              </div>
              <span className="font-medium text-sm">Companion</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Digital Persona Creator. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;