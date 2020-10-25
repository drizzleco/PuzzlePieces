import React from 'react';
import './App.css';
import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from './firebaseConfig.js';
import styled from 'styled-components';
import CanvasDraw from 'react-canvas-draw';
import {CirclePicker} from 'react-color';
import useWindowDimensions from './useWindowDimensions.js';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

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

const Container = styled.div`
  display: flex;
`;

const CanvasContainer = styled(Container)`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Space = styled(Container)`
  width: ${(props) => props.width || 0}px;
  height: ${(props) => props.height || 0}px;
`;

const Wrapper = styled(Container)`
  flex: 1;
  height: 100%;
  background-color: azure;
  flex-direction: column;
  justify-content: center;
`;

const PalleteContainer = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const ButtonContainer = styled(Container)`
  background-color: red;
  align-self: center;
`;

function App() {
  const canvas = React.createRef();
  const canvas2 = React.createRef();
  const [color, setColor] = React.useState();
  const {width} = useWindowDimensions();

  const canvasScalingFactor = 0.5;

  const populate = () => {
    dbh
      .collection('drawings')
      .doc('canvas')
      .get()
      .then((data) => {
        const drawing = data.data().drawing;
        if (drawing) {
          canvas2.current.loadSaveData(drawing, true);
        }
      });
  };

  const changeColor = (color) => {
    setColor(color.hex);
  };

  const clearCanvas = () => {
    canvas.current.clear();
  };

  const saveToFirebase = () => {
    dbh.collection('drawings').doc('canvas').set({
      drawing: canvas.current.getSaveData(),
    });
  };

  return (
    <Wrapper className='App'>
      <Space height={16} />

      <Title>Drawma</Title>

      <CanvasContainer>
        <CanvasDraw
          ref={canvas}
          brushColor={color}
          canvasWidth={width * canvasScalingFactor}
          canvasHeight={width * canvasScalingFactor}
        />
        <Space height={40} />
        <CanvasDraw
          ref={canvas2}
          canvasWidth={width * canvasScalingFactor}
          canvasHeight={width * canvasScalingFactor}
          disabled
          hideInterface
          hideGrid
        />
      </CanvasContainer>
      <PalleteContainer>
        <CirclePicker onChange={changeColor} />
      </PalleteContainer>
      <Space height={20} />
      <ButtonContainer>
        <Button onClick={clearCanvas}>clear canvas</Button>
        <Button onClick={saveToFirebase}>send drawing to firebase</Button>
        <Button onClick={populate}>populate saved drawing from firebase</Button>
      </ButtonContainer>
    </Wrapper>
  );
}

export default App;
