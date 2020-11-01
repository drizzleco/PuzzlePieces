import styled from 'styled-components';

const Space = styled.div`
  display: flex;
  width: ${(props) => props.width || 0}px;
  height: ${(props) => props.height || 0}px;
`;

export default Space;
