import { 
  Handle, 
  Position, 
  useStore,
  NodeResizeControl 
} from 'reactflow'
import { AiOutlineFileText } from 'react-icons/ai'
import { controlState } from '../state'
import { SVGIconContainer } from '../components/SVGIconContainer'
import './ArchNode.css'

const connectionNodeIdSelector = (state) => state.connectionNodeId;
const addingEdgeState = (state) => state.adding;
const resizeControlStyle = {
  background: 'transparent',
  border: 'none',
}

export default function CustomNode({ id, data, selected }) {
  const connectionNodeId = useStore(connectionNodeIdSelector)
  const isAddingEdge = controlState(addingEdgeState)

  const isTarget = connectionNodeId && connectionNodeId !== id;

  const sourceStyle = { zIndex: -1 }
  const targetStyle = { zIndex: -1 }
  const nodeStyle = {}
  const labelStyle = {}
  if (isAddingEdge) sourceStyle.zIndex = 1
  if (isTarget) targetStyle.zIndex = 2
  if (isTarget) nodeStyle.borderStyle = 'dashed'
  let shape = data?.shape || 'square'
  //if (data?.isGroup) shape = 'square'
  let archNodeClasses = `ArchNode ${shape}`
  if (data?.isGroup) archNodeClasses += ' group'
  if (data?.dragTarget) archNodeClasses += ' target'
  if (data?.fontSize) labelStyle.fontSize = `${data?.fontSize}`
  if (data?.bgColor) {
    let c = data?.bgColor
    nodeStyle.backgroundColor = `rgba(${c.r},${c.g},${c.b},${c.a})`
  }
  if (data?.fgColor) {
    let c = data?.fgColor
    nodeStyle.color = `rgba(${c.r},${c.g},${c.b},${c.a})`
  }

  return (
    <div className={archNodeClasses} style={nodeStyle}>
      { data?.file &&
        <SVGIconContainer className={`fileIndicator ${!!!data?.fileExists ? 'missing' : ''}`} size={15}>
          <AiOutlineFileText />
        </SVGIconContainer>
      }
      { selected &&
        <NodeResizeControl style={resizeControlStyle} isVisible={selected} minWidth={100} minHeight={50}>
          <ResizeIcon shape={shape} />
        </NodeResizeControl>
      }
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
      <div className="label" style={labelStyle}>{data?.label}</div>
    </div>
  );
}

function ResizeIcon({ shape }) {
  let bottom = 5
  let right = 5
  if (shape === 'cylinder') {
    bottom = 15
  }
  if (shape === 'circle') {
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="black"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ position: 'absolute', right: right, bottom: bottom }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="16 20 20 20 20 16" />
      <line x1="14" y1="14" x2="20" y2="20" />
    </svg>
  );
}
