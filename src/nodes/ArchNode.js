import { Handle, Position, useStore } from 'reactflow';
import { controlState } from './ArchControls'
import './ArchNode.css'

const connectionNodeIdSelector = (state) => state.connectionNodeId;
const addingEdgeState = (state) => state.adding;

const sourceStyle = { zIndex: 1 };

export default function CustomNode({ id, data }) {
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const addingEdge = controlState(addingEdgeState);

  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;
  const handleClass = `ArchHandle ${addingEdge ? 'enable' : ''}`

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
        {!isConnecting && (
          <Handle
            className={handleClass}
            position={Position.Right}
            type="source"
            style={sourceStyle}
          />
        )}

        <Handle className={handleClass} position={Position.Left} type="target" />
        {data?.label}
      </div>
    </div>
  );
}
