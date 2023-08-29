import { useState } from 'react'
import styled from 'styled-components'
import MarkdownEditor from './markdown.js'
import DiagramEditor from './diagram.js'

export default function Arch() {
  // eslint-disable-next-line
  const [file, setFile] = useState(null)
  const [panning, setPanning] = useState('both')

  console.log(panning)

  return (
    <Wrapper>
      <Top>
        <div>logo</div>
        <PanSelector>
          <Pan selected={panning === 'notes'} onClick={() => setPanning('notes')}>Notes</Pan>
          <Pan selected={panning === 'both'} onClick={() => setPanning('both')}>Both</Pan>
          <Pan selected={panning === 'diagram'} onClick={() => setPanning('diagram')}>Diagram</Pan>
        </PanSelector>
        <div>links</div>
      </Top>
      <Workspace>
        { ['notes','both'].indexOf(panning) >= 0 &&
          <MarkdownSpace>
            <MarkdownEditor />
          </MarkdownSpace>
        }
        { ['diagram','both'].indexOf(panning) >= 0 &&
          <DiagramSpace>
            <DiagramEditor />
          </DiagramSpace>
        }
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
  padding: 5px;
  border-bottom: 1px solid var(--color-border-grey);
`

const Workspace = styled.div`
  display: flex;
`

const MarkdownSpace = styled.div`
  flex: 1;
  border-right: 1px solid var(--color-border-grey);
`

const DiagramSpace = styled.div`
  flex: 2;
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
