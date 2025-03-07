
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
  Edge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Save, 
  LayoutGrid, 
  Trash, 
  UserPlus,
  Settings,
  ZoomIn,
  UserRound,
} from "lucide-react";
import PersonaNode from './orgchart/PersonaNode';
import DepartmentNode from './orgchart/DepartmentNode';
import MeNode from './orgchart/MeNode';
import ConnectionEdge from './orgchart/ConnectionEdge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { 
  OrgChart, 
  OrgChartNode, 
  OrgChartEdge, 
  Persona 
} from '@/types';

interface OrgChartEditorProps {
  orgChart: OrgChart;
  personas: Persona[];
  onSave: (chart: OrgChart) => void;
  onDelete: () => void;
  onEditPersona: (personaId: string) => void;
  onStartConversation: (personaId: string) => void;
}

// Define node types
const nodeTypes = {
  persona: PersonaNode,
  department: DepartmentNode,
  me: MeNode,
};

// Define edge types
const edgeTypes = {
  connection: ConnectionEdge,
};

const OrgChartEditor = ({ 
  orgChart, 
  personas, 
  onSave, 
  onDelete,
  onEditPersona,
  onStartConversation,
}: OrgChartEditorProps) => {
  // Chart name state
  const [chartName, setChartName] = useState(orgChart.name);
  
  // Flow chart state
  const [nodes, setNodes, onNodesChange] = useNodesState(orgChart.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(orgChart.edges);
  
  // Selected node/edge
  const [selectedNode, setSelectedNode] = useState<OrgChartNode | null>(null);
  const [selectedNodePersona, setSelectedNodePersona] = useState<string | undefined>(undefined);
  const [selectedNodeRole, setSelectedNodeRole] = useState<string>('');
  const [selectedNodeDepartment, setSelectedNodeDepartment] = useState<string>('');
  
  // Flow ref
  const reactFlowWrapper = useRef(null);
  
  // Handle connections
  const onConnect = useCallback((params: Connection) => {
    // Check if one of the nodes is the "me" node
    const sourceNode = nodes.find(n => n.id === params.source);
    const targetNode = nodes.find(n => n.id === params.target);
    const isMeConnection = 
      (sourceNode && sourceNode.type === 'me') || 
      (targetNode && targetNode.type === 'me');
    
    // Create connection edge
    const newEdge: OrgChartEdge = {
      ...params,
      id: `e-${nanoid(6)}`,
      type: isMeConnection ? 'connection' : 'default',
      animated: false,
      label: 'Reports To',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      data: {
        onStartConversation: handleStartConversation,
        onDefineRelationship: handleDefineRelationship,
        onDeleteConnection: handleDeleteConnection,
      }
    };
    
    setEdges((eds) => addEdge(newEdge, eds));
  }, [nodes, setEdges]);
  
  // Handle node selection
  const onNodeClick = useCallback((event: any, node: OrgChartNode) => {
    setSelectedNode(node);
    setSelectedNodePersona(node.data.personaId);
    setSelectedNodeRole(node.data.role || '');
    setSelectedNodeDepartment(node.data.department || '');
  }, []);
  
  // Clear selection
  const clearSelection = () => {
    setSelectedNode(null);
    setSelectedNodePersona(undefined);
    setSelectedNodeRole('');
    setSelectedNodeDepartment('');
  };
  
  // Add a new persona node
  const addPersonaNode = () => {
    const nodeId = `n-${nanoid(6)}`;
    const newNode: OrgChartNode = {
      id: nodeId,
      type: 'persona',
      position: {
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 100,
      },
      data: {
        label: 'New Employee',
        role: 'Employee',
        department: '',
        onEdit: onEditPersona,
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    clearSelection();
  };
  
  // Add a department node
  const addDepartmentNode = () => {
    const nodeId = `d-${nanoid(6)}`;
    const newNode: OrgChartNode = {
      id: nodeId,
      type: 'department',
      position: {
        x: 300 + Math.random() * 200,
        y: 300 + Math.random() * 100,
      },
      data: {
        label: 'Department',
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    clearSelection();
  };
  
  // Add a "Me" node
  const addMeNode = () => {
    // Check if a Me node already exists
    const existingMeNode = nodes.find(node => node.type === 'me');
    if (existingMeNode) {
      toast.error('You can only have one "Me" node');
      return;
    }
    
    const nodeId = `me-${nanoid(6)}`;
    const newNode: OrgChartNode = {
      id: nodeId,
      type: 'me',
      position: {
        x: 400 + Math.random() * 200,
        y: 200 + Math.random() * 100,
      },
      data: {
        label: 'Me',
        role: 'Your Role',
        department: '',
        onEdit: () => {
          toast.info('Editing "Me" functionality coming soon!');
        },
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    clearSelection();
  };
  
  // Update node properties
  const updateSelectedNode = () => {
    if (!selectedNode) return;
    
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNode.id) {
          const persona = personas.find(p => p.id === selectedNodePersona);
          
          return {
            ...n,
            personaId: selectedNodePersona,
            data: {
              ...n.data,
              label: persona?.name || n.data.label,
              role: selectedNodeRole,
              department: selectedNodeDepartment,
              onEdit: n.type === 'persona' ? onEditPersona : n.data.onEdit,
              personaId: selectedNodePersona, // Ensure this is passed to the node
            },
          };
        }
        
        return n;
      })
    );
    
    toast.success('Node updated');
  };
  
  // Delete selected node
  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter(
      (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
    ));
    
    clearSelection();
    toast.success('Node deleted');
  };
  
  // Connection context menu handlers
  const handleStartConversation = (edgeId: string) => {
    const edge = edges.find(e => e.id === edgeId);
    if (!edge) return;
    
    // Find source and target nodes
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    // Determine which node is the persona (not the "me" node)
    let personaNode;
    if (sourceNode?.type === 'persona') {
      personaNode = sourceNode;
    } else if (targetNode?.type === 'persona') {
      personaNode = targetNode;
    }
    
    if (personaNode?.personaId) {
      onStartConversation(personaNode.personaId);
    } else {
      toast.error('No persona associated with this connection');
    }
  };
  
  const handleDefineRelationship = (edgeId: string, relationshipType: string) => {
    setEdges(eds => 
      eds.map(edge => {
        if (edge.id === edgeId) {
          let label;
          switch (relationshipType) {
            case 'reports-to':
              label = 'Reports To';
              break;
            case 'no-report':
              label = 'No Report';
              break;
            case 'future-report':
              label = 'Future Report';
              break;
            default:
              label = 'Relationship';
          }
          
          return {
            ...edge,
            label,
            data: {
              ...edge.data,
              relationshipType,
              onStartConversation: handleStartConversation,
              onDefineRelationship: handleDefineRelationship,
              onDeleteConnection: handleDeleteConnection,
            }
          };
        }
        return edge;
      })
    );
    
    toast.success('Relationship updated');
  };
  
  const handleDeleteConnection = (edgeId: string) => {
    setEdges(eds => eds.filter(e => e.id !== edgeId));
    toast.success('Connection deleted');
  };
  
  // Save the chart
  const handleSave = () => {
    const updatedChart: OrgChart = {
      ...orgChart,
      name: chartName,
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    };
    
    onSave(updatedChart);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <Input
            value={chartName}
            onChange={(e) => setChartName(e.target.value)}
            className="text-xl font-semibold"
            placeholder="Organization Chart Name"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearSelection}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Clear Selection
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Chart
          </Button>
          
          <Button 
            size="sm"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Chart
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <div ref={reactFlowWrapper} className="flex-1 h-full border rounded-lg overflow-hidden bg-secondary/10">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={clearSelection}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
          >
            <Controls />
            <MiniMap zoomable pannable />
            <Background gap={12} size={1} />
            
            <Panel position="top-left">
              <div className="bg-card rounded-lg shadow-md border p-3">
                <p className="text-xs font-medium mb-2">Add Elements</p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={addPersonaNode}
                  >
                    <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                    Add Person
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={addMeNode}
                  >
                    <UserRound className="h-3.5 w-3.5 mr-1.5" />
                    Add Me
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={addDepartmentNode}
                  >
                    <ZoomIn className="h-3.5 w-3.5 mr-1.5" />
                    Add Department
                  </Button>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
        
        {selectedNode && (
          <div className="w-80 ml-4 border rounded-lg p-4 bg-card">
            <h3 className="font-medium mb-4 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Node Properties
            </h3>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
                <TabsTrigger value="styling" className="flex-1">Styling</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-4">
                {selectedNode.type === 'persona' && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Persona</label>
                      <Select 
                        value={selectedNodePersona} 
                        onValueChange={setSelectedNodePersona}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a persona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No persona</SelectItem>
                          {personas.map((persona) => (
                            <SelectItem key={persona.id} value={persona.id}>
                              {persona.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Role</label>
                      <Input
                        value={selectedNodeRole}
                        onChange={(e) => setSelectedNodeRole(e.target.value)}
                        placeholder="e.g. CEO, Manager, Developer"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Department</label>
                      <Input
                        value={selectedNodeDepartment}
                        onChange={(e) => setSelectedNodeDepartment(e.target.value)}
                        placeholder="e.g. Marketing, Engineering"
                      />
                    </div>
                  </>
                )}
                
                {selectedNode.type === 'me' && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Name</label>
                      <Input
                        value={selectedNode.data.label}
                        onChange={(e) => {
                          setNodes((nds) =>
                            nds.map((n) => {
                              if (n.id === selectedNode.id) {
                                return {
                                  ...n,
                                  data: {
                                    ...n.data,
                                    label: e.target.value,
                                  },
                                };
                              }
                              return n;
                            })
                          );
                        }}
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Role</label>
                      <Input
                        value={selectedNodeRole}
                        onChange={(e) => setSelectedNodeRole(e.target.value)}
                        placeholder="e.g. CEO, Manager, Developer"
                      />
                    </div>
                  </>
                )}
                
                {selectedNode.type === 'department' && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">Department Name</label>
                    <Input
                      value={selectedNode.data.label}
                      onChange={(e) => {
                        setNodes((nds) =>
                          nds.map((n) => {
                            if (n.id === selectedNode.id) {
                              return {
                                ...n,
                                data: {
                                  ...n.data,
                                  label: e.target.value,
                                },
                              };
                            }
                            return n;
                          })
                        );
                      }}
                      placeholder="Department name"
                    />
                  </div>
                )}
                
                <div className="pt-4 flex space-x-2">
                  <Button 
                    onClick={updateSelectedNode}
                    className="flex-1"
                  >
                    Apply Changes
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    onClick={deleteSelectedNode}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="styling" className="space-y-4 mt-4">
                <p className="text-xs text-muted-foreground">
                  Styling options coming soon
                </p>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgChartEditor;
