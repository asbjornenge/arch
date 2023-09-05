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
  const [shape, setShape] = useState(node?.data?.shape || 'square')

  useEffect(() => {
    setNodes((nds) =>
      nds.map(n => {
        if (n.id === node.id) {
          n.data = {
            ...n.data,
            label: label,
            shape: shape,
            file: file,
            fileExists: fileExists
          }
        }
        return n
      })
    )
  }, [label, file, shape, fileExists, node.id, setNodes])

  useEffect(() => {
    const checkFileExistence = async () => {
      if (!rootFile) return
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
    if (!rootFile) return
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
    clearTimeout(window.nodeChangeTimeout)
    window.nodeChangeTimeout= setTimeout(() => {
      onChange('node')
    }, 1000)
  }

  return (
    <div className={`NodeEditor ${shape}`}>
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
      <ShapeSelector>
        <Shape selected={shape === 'square'} onClick={() => setShape('square')}><Square /></Shape>
        <Shape selected={shape === 'circle'} onClick={() => setShape('circle')}><Circle /></Shape>
        <Shape selected={shape === 'cylinder'} onClick={() => setShape('cylinder')}><Cylinder /></Shape>
      </ShapeSelector>
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

const ShapeSelector  = styled.div`
  display: flex;
  margin-top: 5px;
  gap: 5px;
`

const Shape = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => props.selected ? 
  'background-color: var(--color-bg-grey);' : ''
  }
`

const Square = styled.div`
  width: 35px;
  height: 40px;
  border: 1px solid black;
  border-radius: 3px;
  background-color: white;
`

const Circle = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid black;
  border-radius: 50%;
  background-color: white;
`

const Cylinder = styled.div`
  width: 30px;
  height: 40px;
  border: 1px solid black;
  --r: 5px;
  /* whatever values/units you want */
  background: 
    radial-gradient(50% var(--r) at 50% var(--r), var(--color-border-grey) 99.99%, #0000 0),
    radial-gradient(50% var(--r) at 50% calc(100% - var(--r)), #fff3 99.99%, #0000 0),
    white;
  border-radius: 100% / calc(var(--r) * 2);
`
