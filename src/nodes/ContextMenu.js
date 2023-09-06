import React, { useCallback } from 'react'
import { uid } from 'uid'
import { useReactFlow } from 'reactflow'
import './ContextMenu.css'

export default function ContextMenu({ id, top, left, right, bottom, setNode, parentNode, ...props }) {
  const { getNode, setNodes, addNodes, setEdges, getNodes } = useReactFlow();

  const node = getNode(id)
  const nodes = getNodes()
  const children = nodes.filter(n => n.parentNode === id)

  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({ ...node, id: uid(8), position });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id))
    setEdges((edges) => edges.filter((edge) => edge.source !== id))
  }, [id, setNodes, setEdges]);

  const editNode = useCallback(() => {
    const node = getNode(id)
    setNode(node)
  }, [id, setNode, getNode])

  const decoupleNode = useCallback(() => {
    setNodes((nds) =>
      nds.map(n => {
        if (n.id === id) {
          let parentNodeId = n.parentNode
          const parent = getNode(parentNodeId)
          const parentRightX = parent.position.x + parent.width + 20
          const parentCenterY = parent.position.y + parent.height/2 - n.height/2
          n.position = { x: parentRightX, y: parentCenterY }
          delete n.parentNode
          delete n.extend
        }
        return n
      })
    )
  },[id, setNodes, getNode])

  return (
    <div style={{ top, left, right, bottom }} className="context-menu" {...props}>
      <button onClick={editNode}>edit</button>
      <button onClick={duplicateNode}>duplicate</button>
      { node?.parentNode &&
        <button onClick={decoupleNode}>ungroup</button>
      }
      { children.length <= 0 &&
      <button onClick={deleteNode}>delete</button>
      }
    </div>
  );
}

