
import { memo } from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  Edge,
} from '@xyflow/react';
import ConnectionContextMenu from './ConnectionContextMenu';

// Define a proper interface for the edge data that extends Edge
interface ConnectionEdgeData {
  relationshipType?: string;
  label?: string;
  onStartConversation?: (edgeId: string) => void;
  onDefineRelationship?: (edgeId: string, type: string) => void;
  onDeleteConnection?: (edgeId: string) => void;
}

const ConnectionEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  animated,
  label,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as ConnectionEdgeData | undefined;
  const edgeLabel = edgeData?.label || label;

  const handleStartConversation = () => {
    if (edgeData?.onStartConversation) {
      edgeData.onStartConversation(id);
    }
  };

  const handleDefineRelationship = (type: string) => {
    if (edgeData?.onDefineRelationship) {
      edgeData.onDefineRelationship(id, type);
    }
  };

  const handleDeleteConnection = () => {
    if (edgeData?.onDeleteConnection) {
      edgeData.onDeleteConnection(id);
    }
  };

  // Determine styling based on relationship type
  const getEdgeStyle = () => {
    const baseStyle = { ...style };
    const relationshipType = edgeData?.relationshipType;
    
    if (relationshipType === 'reports-to') {
      return { 
        ...baseStyle, 
        strokeWidth: 2,
        stroke: '#10b981' // Green for "Reports To"
      };
    } else if (relationshipType === 'no-report') {
      return { 
        ...baseStyle, 
        strokeWidth: 1.5,
        strokeDasharray: '5,5',
        stroke: '#6b7280' // Gray for "No Report"
      };
    } else if (relationshipType === 'future-report') {
      return { 
        ...baseStyle, 
        strokeWidth: 1.5,
        strokeDasharray: '8,4',
        stroke: '#3b82f6' // Blue for "Future Report"
      };
    }
    
    return baseStyle;
  };

  return (
    <ConnectionContextMenu
      onStartConversation={handleStartConversation}
      onDefineRelationship={handleDefineRelationship}
      onDeleteConnection={handleDeleteConnection}
    >
      <g>
        <path
          id={id}
          style={getEdgeStyle()}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
        />
        {edgeLabel && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: 'all',
              }}
              className="bg-background text-xs px-2 py-1 rounded border shadow-sm nodrag"
            >
              {edgeLabel}
            </div>
          </EdgeLabelRenderer>
        )}
      </g>
    </ConnectionContextMenu>
  );
};

export default memo(ConnectionEdge);
