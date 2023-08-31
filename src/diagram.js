import { useState, useRef, useCallback } from 'react'
import ReactFlow, {
  Panel,
  MiniMap,
  Background,
  MarkerType,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'
import NodeEditor from './nodes/NodeEditor' 
import ContextMenu from './nodes/ContextMenu' 
import ArchNode from './nodes/ArchNode'
import ArchEdge from './nodes/ArchEdge'
import ArchControls from './nodes/ArchControls'
import ArchConnectionLine from './nodes/ArchConnectionLine'
import 'reactflow/dist/style.css'

const EDGE_STROKE_WIDTH = 2
const EDGE_COLOR = 'black'

const initialNodes = [
  { id: '1', type: 'arch', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', type: 'arch', position: { x: 300, y: 300 }, data: { label: '2' } }
]

const initialEdges = []

const nodeTypes = {
  arch : ArchNode
}

const edgeTypes = {
  arch: ArchEdge,
}

const connectionLineStyle = {
  strokeWidth: EDGE_STROKE_WIDTH,
  stroke: EDGE_COLOR,
}

const defaultEdgeOptions = {
  style: { strokeWidth: EDGE_STROKE_WIDTH, stroke: EDGE_COLOR },
  type: 'arch',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: EDGE_COLOR,
  },
}

export default function DiagramEditor({ offsetY, offsetX }) {
  // eslint-disable-next-line
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [node, setNode] = useState(null)
  const [menu, setMenu] = useState(null)
  const ref = useRef(null)

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    //const pane = ref.current.getBoundingClientRect(); Can use to calc edge collision with menu

    let top = event.clientY - offsetY
    let left = event.clientX - offsetX

    setMenu({
      id: node.id,
      top: top,
      left: left,
    })
  }

  const onPaneClick = useCallback(() => { 
    setMenu(null)
//    setNode(null)
  }, [setMenu])

  return (
    <ReactFlow
      ref={ref}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeContextMenu={onNodeContextMenu}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineStyle={connectionLineStyle}
      connectionLineComponent={ArchConnectionLine}
    >
      <MiniMap />
      <ArchControls setNodes={setNodes} />
      <Background />
      {menu && <ContextMenu onClick={onPaneClick} {...menu} setNode={setNode} />}
      {node && <Panel position="top-right"><NodeEditor key={node?.id} node={node} setNode={setNode} setNodes={setNodes} /></Panel>}
    </ReactFlow>
  )
}
