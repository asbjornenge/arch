import {
  Controls,
  ControlButton,
  useReactFlow
} from 'reactflow'
import { uid } from 'uid'
import styled from 'styled-components'
import { create } from 'zustand'
import { FiArrowUpRight } from 'react-icons/fi'
import { AiOutlineAppstoreAdd } from 'react-icons/ai'

export const controlState = create((set) => ({
  adding: false,
  toggleAddingEdge: () => set((state) => ({ adding: !state.adding }))
}))

export default function ArchControls({ setNodes }) {
  // TODO: Sett adding mode while holding down ctrl ??
  const { adding, toggleAddingEdge } = controlState()
  const { project } = useReactFlow()

  const edgeAddingStyle = {}
  if (adding) edgeAddingStyle.backgroundColor = 'var(--color-bg-dark-grey)' 

  const handleAddNode = () => {
    const id = uid(8)
    const newNode = {
      id,
      // we are removing the half of the node width (75) to center the new node
      position: project({ x: 0, y: 0 }),
      data: { label: id },
      type: 'arch'
    }
    setNodes((nds) => nds.concat(newNode))
  }

  return (
    <Controls>
      <ControlButton style={edgeAddingStyle} onClick={toggleAddingEdge} title="another action">
        <ControlIconContainer>
          <FiArrowUpRight />
        </ControlIconContainer>
      </ControlButton>
      <ControlButton onClick={handleAddNode} title="action">
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
