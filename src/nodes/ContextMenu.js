import React, { useCallback } from 'react'
import { uid } from 'uid'
import { useReactFlow } from 'reactflow'
import './ContextMenu.css'

export default function ContextMenu({ id, top, left, right, bottom, setNode, ...props }) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({ ...node, id: uid(8), position });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  const editNode = useCallback(() => {
    const node = getNode(id)
    setNode(node)
  }, [id, setNode, getNode])

  return (
    <div style={{ top, left, right, bottom }} className="context-menu" {...props}>
      <button onClick={editNode}>edit</button>
      <button onClick={duplicateNode}>duplicate</button>
      <button onClick={deleteNode}>delete</button>
    </div>
  );
}

