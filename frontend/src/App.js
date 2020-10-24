import React from 'react';
import './App.css';
import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from './firebaseConfig.js';
import styled from 'styled-components';
import CanvasDraw from 'react-canvas-draw';

firebase.initializeApp(firebaseConfig);

const dbh = firebase.firestore();

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
  margin-bottom: 16px;
  margin-top: 0px;
`;

const Button = styled.button`
  background: purple;
  border-radius: 3px;
  border: 2px solid purple;
  color: white;
  width: 50%;
  margin: 4px;
  padding: 0.25em 1em;
  transition: all 0.1s ease-in-out;
  &:hover {
    transform: scale(0.95);
  }
`;

const CanvasContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-around;
  flex-direction: row;
`;

const Space = styled.div`
  width: ${(props) => props.width || 0}px;
  height: ${(props) => props.height || 0}px;
`;

const Wrapper = styled.div`
  flex: 1;
  height: 100%;
  background-color: azure;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  align-self: center;
`;
const alertNow = () => {
  dbh.collection('characters').doc('luigi').set({
    employment: 'dude',
    outfitColor: 'red',
    specialAttack: 'fireball',
  });
};

function App() {
  const canvas = React.createRef();
  const canvas2 = React.createRef();
  const [drawData, setDrawData] = React.useState();
  const [color, setColor] = React.useState();

  const getSave = () => {
    const stringObject = canvas.current.getSaveData();
    setDrawData(stringObject);
  };

  const populate = () => {
    canvas2.current.loadSaveData(drawData, true);
  };

  const changeColor = () => {
    setColor('#' + Math.floor(Math.random() * 16777215).toString(16));
  };

  const clearCanvas = () => {
    canvas.current.clear();
  };

  return (
    <Wrapper className='App'>
      <Space height={16} />
      <Title>Drawma</Title>
      <CanvasContainer>
        <CanvasDraw ref={canvas} brushColor={color} />
        <CanvasDraw ref={canvas2} />
      </CanvasContainer>
      <Space height={20} />
      <ButtonContainer>
        <Button onClick={changeColor}>change color</Button>
        <Button onClick={clearCanvas}>clear canvas</Button>
        <Button onClick={alertNow}>send firebase ex</Button>
        <Button onClick={getSave}>log drawing save</Button>
        <Button onClick={populate}>populate saved drawing</Button>
      </ButtonContainer>
    </Wrapper>
  );
}

export default App;
