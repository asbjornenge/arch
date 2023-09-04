import React, { useState, useEffect } from 'react'
import { fileState } from '../state'
import './NodeEditor.css'

export default function NodeEditor({ node, setNode, setNodes, ...props }) {
  const [label, setLabel] = useState(node?.data?.label || '')
  const { file: rootFile } = fileState()
  const [file, setFile] = useState(node?.data?.file || '')
  const [fileExists, setFileExists] = useState(true)

  useEffect(() => {
    setNodes((nds) =>
      nds.map(n => {
        if (n.id === node.id) {
          n.data = {
            ...n.data,
            label: label,
            file: file
          }
        }
        return n
      })
    )
  }, [label, file, node.id, setNodes])

  useEffect(() => {
    const checkFileExistence = async () => {
      let path = rootFile.split('/')
      path.splice(-1)
      path.push(file)
      path = path.join('/')
      const res = await window.electron.fileExists(path)
      setFileExists(res)
    }
    checkFileExistence()
  }, [file, rootFile, setFileExists])

  const handleClose = () => { 
    setNode(null)
  }


  return (
    <div className="NodeEditor">
      <label>label:</label>
      <input value={label} onChange={(evt) => setLabel(evt.target.value)} />
      <label>file:</label>
      <input value={file} onChange={(evt) => setFile(evt.target.value)} className={fileExists ? '' : 'error'} />
      <div className="buttons">
        <button className="archButton" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}

