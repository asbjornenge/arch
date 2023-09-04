import { useState, useCallback, useEffect } from 'react'
import { ReactFlowProvider } from 'reactflow'
import styled from 'styled-components'
import ohash from 'object-hash'
import { 
  AiOutlineFolderOpen, 
  AiOutlineSave, 
  AiOutlineGithub 
} from 'react-icons/ai'
import MarkdownEditor from './markdown.js'
import DiagramEditor from './diagram.js'
import archLogoSvg from './graphics/logo.svg'
import { SVGIconContainerButton } from './components/SVGIconContainer'

const TOP_HEIGHT = 45
const WORKSPACE_HEIGHT_MARGIN = 2

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
  const [fileHash, setFileHash] = useState('')
  const [archHash, setArchHash] = useState('')

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

  const getContent = () => {
    return {
      notes: markdown,
      diagram: rfInstance ? rfInstance.toObject() : {}
    }
  }

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
    if (!res) return
    setFile(res.file)
    const content = JSON.parse(res.content)
    setMarkdown(content.notes)
    setFlow(content.diagram)
    setFileHash(ohash(content))
    setArchHash(ohash(content))
  }

  const handleSaveFile = async () => {
    if (!file) return await handleSaveFileDialog()
    const content = getContent()
    await window.electron.saveFile(file, JSON.stringify(content))
    setFileHash(ohash(content))
  }

  const handleSaveFileDialog = async () => {
    const content = getContent()
    const dialogConfig = {
      defaultPath: '',
      payload: JSON.stringify(content)
    }
    const res = await window.electron.openDialog('showSaveDialog', dialogConfig)
    if (!res) return
    setFile(res.file)
    setFileHash(ohash(content))
  }


  const handleExternalLink = async (url) => {
    await window.electron.openExternalLink(url)
  }

  const handleChange = (prop, val) => {
    const content = getContent()
    if (prop === 'notes')
      content[prop] = val
    setArchHash(ohash(content))
  }

  let markdownWidth = size.width / 3
  if (markdownWidth < 440) markdownWidth = 440 // Smallest possible to avoid menu wrapping
  let diagramWidth = size.width - markdownWidth
  const workspaceHeight = size.height - TOP_HEIGHT - WORKSPACE_HEIGHT_MARGIN
  if (panning === 'notes') markdownWidth = size.width
  if (panning === 'diagram') diagramWidth = size.width
  let fileName = ''
  if (file) fileName = file.split('/')[file.split('/').length-1]
  const hasDiff = archHash !== fileHash

  return (
    <Wrapper>
      <Top>
        <TopUpper>
          <TopLeft>
            <Logo src={archLogoSvg} />
            <SVGIconContainerButton onClick={handleOpenFile} size={20}>
              <AiOutlineFolderOpen />
            </SVGIconContainerButton>
            <SVGIconContainerButton onClick={handleSaveFile} iconsize={17} disabled={!hasDiff}>
              <AiOutlineSave />
            </SVGIconContainerButton>
            <FileName>{fileName}</FileName>
          </TopLeft>
          <PanSelector>
            <Pan selected={panning === 'notes'} onClick={() => setPanning('notes')}>Notes</Pan>
            <Pan selected={panning === 'both'} onClick={() => setPanning('both')}>Both</Pan>
            <Pan selected={panning === 'diagram'} onClick={() => setPanning('diagram')}>Diagram</Pan>
          </PanSelector>
          <TopRight>
            <SVGIconContainerButton onClick={() => handleExternalLink('https://github.com/asbjornenge/arch')}>
              <AiOutlineGithub />
            </SVGIconContainerButton>
          </TopRight>
        </TopUpper>
      </Top>
      <Workspace>
        <MarkdownSpace width={markdownWidth} height={workspaceHeight} hidden={['both', 'notes'].indexOf(panning) < 0}>
          <MarkdownEditor height={workspaceHeight} markdown={markdown} setMarkdown={setMarkdown} onChange={handleChange} />
        </MarkdownSpace>
        <DiagramSpace width={diagramWidth} height={workspaceHeight} hidden={['both', 'diagram'].indexOf(panning) < 0}>
          <ReactFlowProvider>
            <DiagramEditor flow={flow} setRfInstance={setRfInstance} offsetY={TOP_HEIGHT} offsetX={size.width - diagramWidth} onChange={handleChange} />
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
  flex-direction: column;
  border-bottom: 1px solid var(--color-border-grey);
  height: ${TOP_HEIGHT}px;
`
const TopUpper = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TopLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  width: 200px;
`

const TopRight = styled.div`
  width: 200px;
  display: flex;
  justify-content: flex-end;
`

const FileName = styled.div`
  font-size: 0.7em;
  margin-top: 4px;
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
