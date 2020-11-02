import styled from 'styled-components';
import colors from '../colors';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
  background-color: ${colors.yellow2};
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const Button = styled.button`
  background: ${colors.yellow4};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  color: ${colors.white16};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Sniglet;
  outline: none;
`;
