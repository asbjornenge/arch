import { useState, useCallback, useEffect } from 'react'
import { ReactFlowProvider } from 'reactflow'
import styled from 'styled-components'
import MarkdownEditor from './markdown.js'
import DiagramEditor from './diagram.js'
import archLogoSvg from './graphics/logo.svg'

const TOP_HEIGHT = 30
const WORKSPACE_HEIGHT_MARGIN = 12

const getSize = () => {
  return { 
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

export default function Arch() {
  const [file, setFile] = useState(null)
  const [panning, setPanning] = useState('both')
  const [size, setSize] = useState(getSize())
  const [flow, setFlow] = useState(null)
  const [markdown, setMarkdown] = useState('')
  const [rfInstance, setRfInstance] = useState(null)

  const handleResize = useCallback(() => {
    let ticking = false;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        setSize(getSize());
        ticking = false;
      });
      ticking = true;
    } 
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize])

  const handleOpenFile = async () => {
    const dialogConfig = {
      title: 'Select a file',
      buttonLabel: 'This one will do',
      properties: ['openFile'],
      filters: [
        { name: 'Arch file', extensions: ['arch'] },
      ]
    }
    const res = await window.electron.openDialog('showOpenDialog', dialogConfig)
    setFile(res.file)
    const content = JSON.parse(res.content)
    console.log(content)
    setMarkdown(content.notes)
    setFlow(content.diagram)
  }

  const handleSaveFile = async () => {
    // How to fetch Markdown and Diagram?
    const dialogConfig = {
      defaultPath: file || '',
      payload: JSON.stringify({
        notes: markdown,
        diagram: rfInstance.toObject()
      })
    }
    const res = await window.electron.openDialog('showSaveDialog', dialogConfig)
    console.log(res)
    setFile(res.file)
  }

  let markdownWidth = size.width / 3
  if (markdownWidth < 440) markdownWidth = 440 // Smallest possible to avoid menu wrapping
  let diagramWidth = size.width - markdownWidth
  const workspaceHeight = size.height - TOP_HEIGHT - WORKSPACE_HEIGHT_MARGIN
  if (panning === 'notes') markdownWidth = size.width
  if (panning === 'diagram') diagramWidth = size.width

  return (
    <Wrapper>
      <Top>
        <TopLeft>
          <Logo src={archLogoSvg} />
          <div onClick={handleOpenFile}>Open</div>
          <div onClick={handleSaveFile}>Save</div>
          <div>{file}</div>
        </TopLeft>
        <PanSelector>
          <Pan selected={panning === 'notes'} onClick={() => setPanning('notes')}>Notes</Pan>
          <Pan selected={panning === 'both'} onClick={() => setPanning('both')}>Both</Pan>
          <Pan selected={panning === 'diagram'} onClick={() => setPanning('diagram')}>Diagram</Pan>
        </PanSelector>
        <div>links</div>
      </Top>
      <Workspace>
        <MarkdownSpace width={markdownWidth} height={workspaceHeight} hidden={['both', 'notes'].indexOf(panning) < 0}>
          <MarkdownEditor height={workspaceHeight} markdown={markdown} setMarkdown={setMarkdown} />
        </MarkdownSpace>
        <DiagramSpace width={diagramWidth} height={workspaceHeight} hidden={['both', 'diagram'].indexOf(panning) < 0}>
          <ReactFlowProvider>
            <DiagramEditor flow={flow} setRfInstance={setRfInstance} offsetY={TOP_HEIGHT} offsetX={size.width - diagramWidth} />
          </ReactFlowProvider>
        </DiagramSpace>
      </Workspace>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid var(--color-border-grey);
  height: ${TOP_HEIGHT}px;
`

const TopLeft = styled.div`
  display: flex;
`

const Logo = styled.img`
  height: 15px;
`

const Workspace = styled.div`
  display: flex;
`

const MarkdownSpace = styled.div`
  ${props => props.hidden ? 'display: none;' : ''}
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  border-right: 1px solid var(--color-border-grey);
`

const DiagramSpace = styled.div`
  ${props => props.hidden ? 'display: none;' : ''}
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`

const PanSelector = styled.div`
  display: flex;
  border: 1px solid var(--color-border-grey);
  border-radius: 5px;
`

const Pan = styled.div`
  padding: 5px 10px;
  width: 50px;
  text-align: center;
  color: var(--color-text-grey);
  font-size: 0.8em;
  cursor: pointer;
  user-select: none;
  background-color: ${props => props?.selected ? 'var(--color-bg-grey)': 'inherit'};
`
