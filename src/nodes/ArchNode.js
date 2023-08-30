import { 
  Handle, 
  Position, 
  useStore, 
} from 'reactflow'
import { controlState } from './ArchControls'
import './ArchNode.css'

const connectionNodeIdSelector = (state) => state.connectionNodeId;
const addingEdgeState = (state) => state.adding;


export default function CustomNode({ id, data }) {
  const connectionNodeId = useStore(connectionNodeIdSelector)
  const isAddingEdge = controlState(addingEdgeState)

  const isTarget = connectionNodeId && connectionNodeId !== id;

  const sourceStyle = { zIndex: -1 }
  const targetStyle = { zIndex: -1 }
  if (isAddingEdge) sourceStyle.zIndex = 1
  if (isTarget) targetStyle.zIndex = 2

  return (
    <div className="ArchNode">
      <div
        className="ArchNodeBody"
        style={{
          borderStyle: isTarget ? 'dashed' : 'solid',
        }}
      >
        <Handle
          className="ArchHandle"
          position={Position.Right}
          type="source"
          style={sourceStyle}
        />
        <Handle 
          className="ArchHandle"
          position={Position.Left} 
          type="target" 
          style={targetStyle}
        />
        {data?.label}
      </div>
    </div>
  );
}
