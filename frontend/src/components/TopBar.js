import React from 'react';
import styled from 'styled-components';
import colors from '../colors';

export const TopBarDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${colors.yellow4};
  border-radius: 0px 0px 15px 15px;
`;

export const TopBarTitle = styled.h1`
  font-family: Sniglet;
  font-weight: 400;
  color: ${(props) => (props.color ? props.color : colors.white16)};
`;

const TopBar = ({text}) => {
  return (
    <TopBarDiv>
      <TopBarTitle>{text}</TopBarTitle>
    </TopBarDiv>
  );
};

export default TopBar;
