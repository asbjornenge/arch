import { useState } from 'react'
import styled from 'styled-components'

export default function Arch() {
  // eslint-disable-next-line
  const [file, setFile] = useState(null)
  const [panning, setPanning] = useState('both')

  return (
    <Wrapper>
      <Top>
        <div>logo</div>
        <PanSelector>
          <Pan selected={panning === 'doc'} onClick={() => setPanning('doc')}>Doc</Pan>
          <Pan selected={panning === 'both'} onClick={() => setPanning('both')}>Both</Pan>
          <Pan selected={panning === 'diagram'} onClick={() => setPanning('diagram')}>Diagram</Pan>
        </PanSelector>
        <div>links</div>
      </Top>
      <Workspace></Workspace>
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

`

const PanSelector = styled.div`
  display: flex;
  border: 1px solid var(--color-border-grey);
  border-radius: 5px;
`

const Pan = styled.div`
  padding: 5px 10px;
  text-align: center;
  color: var(--color-text-grey);
  font-size: 0.8em;
  cursor: pointer;
  user-select: none;
  background-color: ${props => props?.selected ? 'pink': 'inherit'};
`
