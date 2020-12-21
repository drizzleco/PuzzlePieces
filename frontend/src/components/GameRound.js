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
import GameSound from '../assets/sounds/game.wav';
import FiveSecSound from '../assets/sounds/fivesec.wav';
import SoundButton from './SoundButton';
import {useCookies} from 'react-cookie';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DrawingContainer = styled.div`
  display: flex;
  flex: 4;
  flex-direction: row;
  justify-content: space-between;
  margin: 0px 40px;
`;

const Image = styled.img`
  max-height: 400px;
  width: 100%;
  object-fit: scale-down;
`;

const ReferenceImage = ({source}) => {
  return <Image src={source}></Image>;
};

const VerticalBar = styled.div`
  border-left: 1px solid #000;
  height: 100%sal;
`;

const SizeCircle = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.width};
  border-radius: 50%;
  border: 2px solid;
  background-color: ${(props) => {
    return props.color || colors.black16;
  }};
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

const DrawingBoard = ({image, color, setColor, canvasRef}) => {
  const [brushRadius, setBrushRadius] = React.useState(12);
  // TODO: figure out how to do height and width

  return (
    <DrawingContainer>
      <Container style={{flex: 1}}>
        <ReferenceImage source={image} />
      </Container>
      <Space width={40} />
      <VerticalBar />
      <Space width={40} />
      <Container style={{flex: 1}}>
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
  width: ${(props) => (props.width ? props.width : '50px')};
  background: ${(props) => props.color};
`;

const SliderPointer = styled.div``;

const GameRound = ({gameId}) => {
  const [color, setColor] = React.useState(colors.black16);
  const [seconds, setSeconds] = React.useState(60);
  const [image, setImage] = React.useState('');
  const canvasRef = React.createRef();
  const fiveSecSoundTag = React.createRef();
  const gameSoundTag = React.createRef();
  const gameDoc = dbh.collection('game').doc(gameId);
  const [cookies] = useCookies(['drawmaPlayerId']);
  const playerId = cookies.drawmaPlayerId;

  React.useEffect(() => {
    gameDoc.get().then((game) => {
      setSeconds(game.data().timePerRound);
    });
    gameDoc
      .collection('players')
      .doc(playerId)
      .get()
      .then((player) => {
        setImage(player.data().imageLink);
      });
  }, [gameId]);

  React.useEffect(() => {
    if (seconds === 0) {
      gameDoc
        .collection('drawings')
        .add({
          drawing: canvasRef.current.getSaveData(),
          playerId: playerId,
          imageLink: image,
        })
        .then(() => {
          navigate(`/game/${gameId}/rating`);
        });
    }
    if (seconds === 5) {
      gameSoundTag.current.volume = 0.1;
      fiveSecSoundTag.current.volume = 1;
      fiveSecSoundTag.current.play();
    }
  });

  return (
    <Wrapper>
      <audio autoPlay loop ref={gameSoundTag} src={GameSound} />
      <audio ref={fiveSecSoundTag} src={FiveSecSound} />
      <TopBar text={'ROUND 1'} />
      <Timer seconds={seconds} setSeconds={setSeconds} />
      <DrawingBoard image={image} canvasRef={canvasRef} color={color} setColor={setColor} />
      <HueContainer>
        <ColorPreview color={color} />
        <Space width={20} />
        <ColorPreview width={'20px'} onClick={() => setColor('#000000')} color={'#000000'} />
        <ColorPreview width={'20px'} onClick={() => setColor('#FFFFFF')} color={'#FFFFFF'} />
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
