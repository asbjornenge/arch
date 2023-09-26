import { useState, useRef, useEffect, useCallback } from 'react'
import ReactFlow, {
  Panel,
  addEdge,
  MiniMap,
  Background,
  MarkerType,
  useReactFlow,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import { addNode } from './utils'
import { 
  TOP_HEIGHT,
  ONCHANGE_TIMEOUT 
} from './state'
import ArchEdge from './components/Edge'
import ArchNode from './components/Node'
import NodeEditor from './components/NodeEditor' 
import EdgeEditor from './components/EdgeEditor' 
import NodeContextMenu from './components/NodeContextMenu' 
import EdgeContextMenu from './components/EdgeContextMenu' 
import DiagramControls from './components/DiagramControls'
import ArchConnectionLine from './components/ConnectionLine'
import 'reactflow/dist/style.css'

const EDGE_STROKE_WIDTH = 2
const EDGE_COLOR = 'black'

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

export default function DiagramEditor({ offsetY, offsetX, setRfInstance, flow, onChange, onUndo, onRedo, settings, notesWidth }) {
  // eslint-disable-next-line
  const ref = useRef(null)
  const dragRef = useRef(null)
  const [node, setNode] = useState(null)
  const [edge, setEdge] = useState(null)
  const [target, setTarget] = useState(null)
  const [nodeMenu, setNodeMenu] = useState(null)
  const [edgeMenu, setEdgeMenu] = useState(null)
  const [mousePos, setMousePos] = useState({x: 0, y: 0})
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { project, setViewport, getNode } = useReactFlow()

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds))
    clearTimeout(window.diagramChangeTimeout)
    window.diagramChangeTimeout= setTimeout(() => {
      onChange('diagram')
    }, ONCHANGE_TIMEOUT)
  }, [onChange, setEdges])

  const handleNodesChange = useCallback((data) => {
    onNodesChange(data)
    clearTimeout(window.diagramChangeTimeout)
    window.diagramChangeTimeout= setTimeout(() => {
      onChange('diagram')
    }, ONCHANGE_TIMEOUT)
  }, [onChange, onNodesChange])

  const handleEdgesChange = useCallback((data) => {
    onEdgesChange(data)
    clearTimeout(window.diagramChangeTimeout)
    window.diagramChangeTimeout= setTimeout(() => {
      onChange('diagram')
    }, ONCHANGE_TIMEOUT)
  },[onChange, onEdgesChange])

  const onNodeDragStart = (evt, node) => {
    if (node.parentNode) return // TODO: Allow this later, but it requires sorting fixes and ungroup fixes
    dragRef.current = node
  };

  const onNodeDrag = (evt, node) => {
    // If node has parent, we do not allow setting Target
    if (node.parentNode) return
    // calculate the center point of the node from position and dimensions
    const centerX = node.position.x + node.width / 2;
    const centerY = node.position.y + node.height / 2;

    // find a node where the center point is inside
    const targetNode = nodes.find(
      (n) =>
        centerX > n.position.x &&
        centerX < n.position.x + n.width &&
        centerY > n.position.y &&
        centerY < n.position.y + n.height &&
        n.id !== node.id &&
        !n.parentNode
    );

    setTarget(targetNode);
  };

  const onNodeDragStop = (evt, node) => {
    let target_id = target?.id
    let dragged_id = dragRef?.current?.id

    if (!target_id) return
    if (!dragged_id) return

    const dragged = getNode(dragged_id)
    //if (dragged?.data?.isGroup) return
    if (!target?.data?.isGroup) return

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === dragged_id) {
          const centerTargetX = target.width/2 - dragged.width/2
          const centerTargetY = target.height/2 - dragged.height/2
          node.parentNode = target_id
          node.extend = 'parent'
          node.position = { x: centerTargetX, y: centerTargetY }
        }
        return node;
      }).sort((a,b) => {
        if (a.parentNode && !b.parentNode) return 1
        if (a.parentNode && b.parentNode) {
          if (a?.data?.isGroup && !b?.data?.isGroup) return -1
        }
        return 0
      })
    )

    setTarget(null)
    dragRef.current = null
  }

  /** DETECT COLLISION **/
  useEffect(() => {
    //console.log(target?.id)
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === target?.id) {
          node.data.dragTarget = true
        } else {
          delete node.data.dragTarget
        }
        return node;
      })
    )
  }, [target, setNodes, getNode])

  /** HANDLE LOADING NEW ARCH FILE **/
  useEffect(() => {
    if (!flow) return
    const { x = 0, y = 0, zoom = 1 } = flow.viewport
    setNodes(flow.nodes || [])
    setEdges(flow.edges || [])
    setViewport({ x, y, zoom })
  }, [flow, setNodes, setEdges, setViewport])

  const onNodeContextMenu = (event, node) => {
    event.preventDefault();

    let top = event.clientY - offsetY
    let left = event.clientX - offsetX

    setNodeMenu({
      id: node.id,
      top: top,
      left: left,
    })
  }

  const onEdgeContextMenu = (event, edge) => {
    event.preventDefault();

    let top = event.clientY - offsetY
    let left = event.clientX - offsetX

    setEdgeMenu({
      id: edge.id,
      top: top,
      left: left,
    })
  }

  const handleSetMousePos = useCallback((e) => {
    setMousePos({
      x: e.clientX - notesWidth,
      y: e.clientY - TOP_HEIGHT
    })
  }, [notesWidth])

  const handleAddNode = useCallback((e) => {
    if (e.keyCode === 78 && e.ctrlKey) {
      e.preventDefault()
      e.stopPropagation()
      addNode({ project, setNodes, position: mousePos })
    }
  }, [project, setNodes, mousePos])

  useEffect(() => {
    window.addEventListener('keydown', handleAddNode)
    return () => {
      window.removeEventListener('keydown', handleAddNode)
    }
  }, [handleAddNode])

  const onPaneClick = useCallback(() => { 
    setNodeMenu(null)
    setEdgeMenu(null)
//    setNode(null)
  }, [setNodeMenu])

  return (
    <ReactFlow
      ref={ref}
      nodes={nodes}
      edges={edges}
      onInit={setRfInstance}
      minZoom={0}
      maxZoom={4}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onConnect={onConnect}
      onNodeDrag={onNodeDrag}
      snapToGrid={settings?.snapToGrid === true}
      onPaneClick={onPaneClick}
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      onNodeDragStop={onNodeDragStop}
      onPaneMouseMove={handleSetMousePos}
      onNodeDragStart={onNodeDragStart}
      onNodeContextMenu={onNodeContextMenu}
      onEdgeContextMenu={onEdgeContextMenu}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineStyle={connectionLineStyle}
      connectionLineComponent={ArchConnectionLine}
    >
      <MiniMap />
      <DiagramControls setNodes={setNodes} />
      <Background />
      {nodeMenu && <NodeContextMenu onClick={onPaneClick} {...nodeMenu} setNode={setNode} />}
      {edgeMenu && <EdgeContextMenu onClick={onPaneClick} {...edgeMenu} setEdge={setEdge} />}
      {node && <Panel position="top-right"><NodeEditor key={node?.id} node={node} setNode={setNode} setNodes={setNodes} onChange={onChange} /></Panel>}
      {edge && <Panel position="top-right"><EdgeEditor key={edge?.id} edge={edge} setEdge={setEdge} setEdges={setEdges} onChange={onChange} /></Panel>}
    </ReactFlow>
  )
}
