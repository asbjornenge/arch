import { useState, useRef, useCallback } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'
import ContextMenu from './nodes/ContextMenu' 
import 'reactflow/dist/style.css'

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
]

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]

export default function DiagramEditor() {
  // eslint-disable-next-line
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [menu, setMenu] = useState(null)
  const ref = useRef(null)

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
      })
    },
    [setMenu]
  )

  const onPaneClick = useCallback(() => setMenu(null), [setMenu])

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
      {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
    </ReactFlow>
  )
}
