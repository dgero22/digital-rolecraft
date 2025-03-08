
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

  return (
    <ConnectionContextMenu
      onStartConversation={handleStartConversation}
      onDefineRelationship={handleDefineRelationship}
      onDeleteConnection={handleDeleteConnection}
    >
      <g>
        <path
          id={id}
          style={style}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
        />
        {edgeData?.label && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: 'all',
              }}
              className="bg-background text-xs px-2 py-1 rounded border shadow-sm nodrag"
            >
              {edgeData.label}
            </div>
          </EdgeLabelRenderer>
        )}
      </g>
    </ConnectionContextMenu>
  );
};

export default memo(ConnectionEdge);
