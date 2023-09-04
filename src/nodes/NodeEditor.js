import React, { useState, useEffect } from 'react'
import { 
  MdOutlineTouchApp
} from 'react-icons/md'
import { 
  AiOutlineEdit 
} from 'react-icons/ai'
import styled from 'styled-components'
import { fileState } from '../state'
import './NodeEditor.css'

export default function NodeEditor({ node, setNode, setNodes, onChange, ...props }) {
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
            file: file,
            fileExists: fileExists
          }
        }
        return n
      })
    )
    clearTimeout(window.nodeChangeTimeout)
    window.nodeChangeTimeout= setTimeout(() => {
      onChange('node')
    }, 1000)
  }, [label, file, fileExists, node.id, setNodes, onChange])

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

  const handleTouchFile = async () => {
    let path = rootFile.split('/')
    path.splice(-1)
    path.push(file)
    path = path.join('/')
    const res = await window.electron.touchFile(path)
    setFileExists(res)
  }

  const handleEditFile = () => {}

  const handleClose = () => { 
    setNode(null)
  }

  return (
    <div className="NodeEditor">
      <label>label:</label>
      <input value={label} onChange={(evt) => setLabel(evt.target.value)} />
      <label>file:</label>
      <FileInputWrapper>
        <input value={file} onChange={(evt) => setFile(evt.target.value)} className={fileExists ? '' : 'error'} />
        { !fileExists &&
          <MdOutlineTouchApp onClick={handleTouchFile}  style={{ cursor: 'pointer' }} />
        }
        { fileExists &&
          <AiOutlineEdit onClick={handleEditFile}  style={{ cursor: 'pointer' }} />
        }
      </FileInputWrapper>
      <div className="buttons">
        <button className="archButton" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}

const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`
