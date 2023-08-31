import {
  Controls,
  ControlButton
} from 'reactflow'
import styled from 'styled-components'
import { create } from 'zustand'
import { FiArrowUpRight } from 'react-icons/fi'
import { AiOutlineAppstoreAdd } from 'react-icons/ai'

export const controlState = create((set) => ({
  adding: false,
  toggleAddingEdge: () => set((state) => ({ adding: !state.adding }))
}))

export default function ArchControls() {
  const { adding, toggleAddingEdge } = controlState()

  const edgeAddingStyle = {}
  if (adding) edgeAddingStyle.backgroundColor = 'var(--color-bg-dark-grey)' 

  return (
    <Controls>
      <ControlButton style={edgeAddingStyle} onClick={toggleAddingEdge} title="another action">
        <ControlIconContainer>
          <FiArrowUpRight />
        </ControlIconContainer>
      </ControlButton>
      <ControlButton onClick={() => console.log('action')} title="action">
        <ControlIconContainer>
          <AiOutlineAppstoreAdd />
        </ControlIconContainer>
      </ControlButton>
    </Controls>
  );
}

const ControlIconContainer = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  & svg {
    width: 15px;
    height: 15px;
    max-width: 20px;
    max-height: 20px;
    display: flex;
  }
`
