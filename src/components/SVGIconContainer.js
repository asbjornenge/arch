import styled from 'styled-components'

const DEFAULT_ICON_SIZE = 20
const DEFAULT_ICON_CONTAINER_SIZE = 20

export const SVGIconContainer = styled.div`
  width: ${props => props.size || DEFAULT_ICON_CONTAINER_SIZE}px;
  height: ${props => props.size || DEFAULT_ICON_CONTAINER_SIZE}px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  & svg {
    width: ${props => props.iconsize || DEFAULT_ICON_SIZE}px;
    height: ${props => props.iconsize || DEFAULT_ICON_SIZE}px;
    max-width: ${props => props.size || DEFAULT_ICON_CONTAINER_SIZE}px;
    max-height: ${props => props.size || DEFAULT_ICON_CONTAINER_SIZE}px;
    display: flex;
  }
`

export const SVGIconContainerButton = styled(SVGIconContainer)`
  cursor: pointer;
`
