import React from 'react';
import styled from 'styled-components';
import colors from '../colors';
import SoundButton from './SoundButton';

const TopBarContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const TopBarDiv = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 0px 0px 15px 15px;
  background-color: ${(props) => (props.color ? props.color : colors.yellow4)};
`;

export const TopBarTitle = styled.h1`
  font-family: Sniglet;
  font-weight: 400;
  color: ${(props) => (props.color ? props.color : colors.white16)};
`;

const TopBar = ({text, color, children}) => {
  return (
    <TopBarContainer>
      <TopBarDiv color={color}>{children ? children : <TopBarTitle>{text}</TopBarTitle>}</TopBarDiv>
      <TopBarDiv
        style={{
          position: 'absolute',
          backgroundColor: 'transparent',
          justifyContent: 'flex-end',
        }}
      >
        <SoundButton />
      </TopBarDiv>
    </TopBarContainer>
  );
};

export default TopBar;
