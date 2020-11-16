import React from 'react';
import styled from 'styled-components';
import {HuePicker} from 'react-color';
import CanvasDraw from 'react-canvas-draw';
import {Wrapper} from './style';
import colors from '../colors';
import Space from './Space';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUndoAlt, faStopwatch, faEraser} from '@fortawesome/free-solid-svg-icons';
import dbh from '../firebase.js';
import {navigate} from '@reach/router';
import TopBar from './TopBar';
import game from '../assets/sounds/game.wav';
import fivesec from '../assets/sounds/fivesec.wav';

const Container = styled.div`
  display: flex;
`;

const DrawingContainer = styled.div`
  display: flex;
  flex: 4;
  flex-direction: row;
  margin: 0px 40px;
`;

const Image = styled.img`
  width: 100%;
`;

const ReferenceImage = ({source}) => {
  return <Image src={source}></Image>;
};

const VerticalBar = styled.div`
  border-left: 1px solid #000;
  height: 100%;
`;

const SizeCircle = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.width};
  border-radius: 50%;
  background-color: ${colors.black16};
  cursor: pointer;
`;

const SelectorSettings = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const IconButton = styled(FontAwesomeIcon)`
  cursor: pointer;
`;

const DrawingBoard = ({color, setColor, canvasRef}) => {
  const [brushRadius, setBrushRadius] = React.useState(12);
  // TODO: figure out how to do height and width

  return (
    <DrawingContainer>
      <Container style={{flex: 1}}>
        <ReferenceImage source={'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg'} />
      </Container>
      <Space width={40} />
      <VerticalBar />
      <Space width={40} />
      <Container style={{flex: 3}}>
        <CanvasDraw
          ref={canvasRef}
          brushColor={color}
          brushRadius={brushRadius}
          lazyRadius={0}
          hideGrid
        />
      </Container>
      <Space width={40} />
      <SelectorSettings>
        <SizeCircle width={'40px'} onClick={() => setBrushRadius(20)} />
        <SizeCircle width={'30px'} onClick={() => setBrushRadius(15)} />
        <SizeCircle width={'20px'} onClick={() => setBrushRadius(10)} />
        <SizeCircle width={'16px'} onClick={() => setBrushRadius(8)} />
        <IconButton icon={faUndoAlt} onClick={() => canvasRef.current.undo()} />
        <IconButton icon={faEraser} onClick={() => setColor(colors.white16)} />
      </SelectorSettings>
    </DrawingContainer>
  );
};

const TimerDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 10px;
`;

const TimerText = styled.h2`
  font-family: Sniglet;
  font-size: 24px;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: 0em;
  margin: 0;
  border-left: 3px solid ${colors.yellow4};
`;

const TimerBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${colors.white16};
  border: 3px solid ${colors.yellow4};
  box-sizing: border-box;
  border-radius: 8px;
`;

const format = (seconds) => {
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return mins + ':' + (secs < 10 ? '0' + secs : secs);
};

const Timer = ({seconds, setSeconds}) => {
  React.useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    if (seconds === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [seconds, setSeconds]);

  return (
    <TimerDiv>
      <TimerBox>
        <FontAwesomeIcon icon={faStopwatch} style={{marginLeft: '10px'}} />
        <Space width={10} />
        <TimerText>{format(seconds)}</TimerText>
      </TimerBox>
    </TimerDiv>
  );
};

const HueContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ColorPreview = styled.div`
  height: 25%;
  width: 50px;
  background: ${(props) => props.color};
`;

const SliderPointer = styled.div``;

const GameRound = ({gameId}) => {
  const [color, setColor] = React.useState(colors.black16);
  const [seconds, setSeconds] = React.useState(60);
  const canvasRef = React.createRef();
  const fiveSecSound = React.createRef();
  const bgSound = React.createRef();
  const gameDoc = dbh.collection('game').doc(gameId);

  React.useEffect(() => {
    gameDoc.get().then((game) => {
      setSeconds(game.data().timePerRound);
    });
  }, [gameId]);

  React.useEffect(() => {
    if (seconds === 0) {
      gameDoc
        .collection('drawings')
        .add({
          drawing: canvasRef.current.getSaveData(),
        })
        .then(() => {
          navigate(`/game/${gameId}/finished`);
        });
    }
    if (seconds === 5) {
      bgSound.current.volume = 0.1;
      fiveSecSound.current.volume = 1;
      fiveSecSound.current.play();
    }
  });

  return (
    <Wrapper>
      <audio autoPlay loop ref={bgSound} src={game} />
      <audio ref={fiveSecSound} src={fivesec} />
      <TopBar text={'ROUND 1'} />
      <Timer seconds={seconds} setSeconds={setSeconds} />
      <DrawingBoard canvasRef={canvasRef} color={color} setColor={setColor} />
      <HueContainer>
        <ColorPreview color={color} />
        <Space width={20} />
        <HuePicker
          color={color}
          pointer={SliderPointer}
          width={'80%'}
          height={'25%'}
          onChange={(color) => setColor(color.hex)}
        />
      </HueContainer>
    </Wrapper>
  );
};

export default GameRound;
