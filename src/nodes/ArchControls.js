import {
  Controls,
  ControlButton,
  useStore
} from 'reactflow'
import { create } from 'zustand'

export const controlState = create((set) => ({
  adding: false,
  toggleAddingEdge: () => set((state) => ({ adding: !state.adding }))
}))

export default function ArchControls() {
  const { adding, toggleAddingEdge } = controlState()

  return (
    <Controls>
      <ControlButton onClick={toggleAddingEdge} title="another action">
        <div>E</div>
      </ControlButton>
      <ControlButton onClick={() => console.log('action')} title="action">
        <div>B</div>
      </ControlButton>
    </Controls>
  );
}
