import { useEffect } from 'react'
import {
  Controls,
  ControlButton,
  useReactFlow
} from 'reactflow'
import { uid } from 'uid'
import { FiArrowUpRight } from 'react-icons/fi'
import { AiOutlineExport, AiOutlineAppstoreAdd } from 'react-icons/ai'
import { toPng } from 'html-to-image'
import { getRectOfNodes, getTransformForBounds } from 'reactflow'
import { SVGIconContainer } from '../components/SVGIconContainer'
import { controlState } from '../state'

export default function ArchControls({ setNodes }) {
  // TODO: Sett adding mode while holding down ctrl ??
  const { adding, toggleAddingEdge, setAddingEdge } = controlState()
  const { project, getNodes } = useReactFlow()

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

  const handleSaveDiagram = async () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const viewport = document.querySelector('.react-flow__viewport')
    const viewportBounds = viewport.getBoundingClientRect()
    const imageWidth = viewportBounds.width * 2 // TODO: Allow modify resolution ?
    const imageHeight = viewportBounds.height * 2
    const nodesBounds = getRectOfNodes(getNodes())
    const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2)
    const dataUrl = await toPng(document.querySelector('.react-flow__viewport'), {
      backgroundColor: 'white',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    })
    const a = document.createElement('a');
    a.setAttribute('download', 'arch.png');
    a.setAttribute('href', dataUrl);
    a.click();
  }

  return (
    <Controls>
      <ControlButton onClick={handleSaveDiagram} title="save">
        <SVGIconContainer iconsize={15}>
          <AiOutlineExport />
        </SVGIconContainer>
      </ControlButton>
      <ControlButton style={edgeAddingStyle} onClick={toggleAddingEdge} title="edges">
        <SVGIconContainer iconsize={15}>
          <FiArrowUpRight />
        </SVGIconContainer>
      </ControlButton>
      <ControlButton onClick={handleAddNode} title="new node">
        <SVGIconContainer iconsize={15}>
          <AiOutlineAppstoreAdd />
        </SVGIconContainer>
      </ControlButton>
    </Controls>
  );
}
