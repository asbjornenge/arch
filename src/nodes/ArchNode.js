import { Handle, Position, useStore } from 'reactflow';
import './ArchNode.css'

const connectionNodeIdSelector = (state) => state.connectionNodeId;
const addingEdgeState = (state) => state.addingEdge;

const sourceStyle = { zIndex: 1 };

export default function CustomNode({ id, data }) {
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const addingEdge = useStore(addingEdgeState);

  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;

  return (
    <div className="ArchNode">
      <div
        className="ArchNodeBody"
        style={{
          borderStyle: isTarget ? 'dashed' : 'solid',
        }}
      >
        {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
        {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}
        {!isConnecting && addingEdge && (
          <Handle
            className="ArchHandle"
            position={Position.Right}
            type="source"
            style={sourceStyle}
          />
        )}

        { addingEdge && 
          <Handle className="ArchHandle" position={Position.Left} type="target" />
        }
        {data?.label}
      </div>
    </div>
  );
}
