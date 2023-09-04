import { useEffect } from 'react'
import {
  Controls,
  ControlButton,
  useReactFlow
} from 'reactflow'
import { uid } from 'uid'
import { FiArrowUpRight } from 'react-icons/fi'
import { AiOutlineAppstoreAdd } from 'react-icons/ai'
import { SVGIconContainer } from '../components/SVGIconContainer'
import { controlState } from '../state'

export default function ArchControls({ setNodes }) {
  // TODO: Sett adding mode while holding down ctrl ??
  const { adding, toggleAddingEdge, setAddingEdge } = controlState()
  const { project } = useReactFlow()

  useEffect(() => {
    function downHandler({key}) {
      if (key === 'Control') {
        setAddingEdge(true)
      }
    }

    function upHandler({key}) {
      if (key === 'Control') {
        setAddingEdge(false)
      }
    }
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    };
  }, [setAddingEdge])


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
        <SVGIconContainer iconsize={15}>
          <FiArrowUpRight />
        </SVGIconContainer>
      </ControlButton>
      <ControlButton onClick={handleAddNode} title="action">
        <SVGIconContainer iconsize={15}>
          <AiOutlineAppstoreAdd />
        </SVGIconContainer>
      </ControlButton>
    </Controls>
  );
}
