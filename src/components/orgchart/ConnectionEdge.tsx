
import { memo } from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
} from '@xyflow/react';
import ConnectionContextMenu from './ConnectionContextMenu';

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

  const handleStartConversation = () => {
    if (data?.onStartConversation) {
      data.onStartConversation(id);
    }
  };

  const handleDefineRelationship = (type: string) => {
    if (data?.onDefineRelationship) {
      data.onDefineRelationship(id, type);
    }
  };

  const handleDeleteConnection = () => {
    if (data?.onDeleteConnection) {
      data.onDeleteConnection(id);
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
        {data?.label && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: 'all',
              }}
              className="bg-background text-xs px-2 py-1 rounded border shadow-sm nodrag"
            >
              {data.label}
            </div>
          </EdgeLabelRenderer>
        )}
      </g>
    </ConnectionContextMenu>
  );
};

export default memo(ConnectionEdge);
