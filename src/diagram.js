import { useState, useRef, useCallback } from 'react'
import ReactFlow, {
  Panel,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'
import NodeEditor from './nodes/NodeEditor' 
import ContextMenu from './nodes/ContextMenu' 
import 'reactflow/dist/style.css'

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
]

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

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
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeContextMenu={onNodeContextMenu}
    >
      <MiniMap />
      <Controls />
      <Background />
      {menu && <ContextMenu onClick={onPaneClick} {...menu} setNode={setNode} />}
      {node && <Panel position="top-right"><NodeEditor key={node?.id} node={node} setNode={setNode} setNodes={setNodes} /></Panel>}
    </ReactFlow>
  )
}
