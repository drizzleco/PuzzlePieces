import React from 'react';
import styled from 'styled-components';
import colors from '../colors';

const Wrapper = styled.div`
  position: absolute;
  background: rgba(196, 196, 196, 0.6);
  backdrop-filter: blur(10px);
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Background = styled.div`
  height: 45%;
  width: 100%;
  background: repeating-linear-gradient(
    -70deg,
    ${colors.peach},
    ${colors.peach} 35px,
    ${colors.peach1} 35px,
    ${colors.peach1} 70px
  );
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TextWrapper = styled.div`
  background: ${colors.orange2};
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.h1`
  color: ${colors.purple3};
  font-size: 65px;
  font-family: Sniglet;
`;

const TransitionScreen = ({visible, text}) => {
  if (visible) {
    return (
      <Wrapper>
        <Background>
          <TextWrapper>
            <Text>{text}</Text>
          </TextWrapper>
        </Background>
      </Wrapper>
    );
  }
  return null;
};

export default TransitionScreen;
