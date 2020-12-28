import React from 'react';
import styled from 'styled-components';
import {HuePicker} from 'react-color';
import CanvasDraw from 'react-canvas-draw';
import {Wrapper} from './style';
import colors from '../colors';
import Space from './Space';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUndoAlt, faEraser} from '@fortawesome/free-solid-svg-icons';
import dbh from '../firebase.js';
import {navigate} from '@reach/router';
import TopBar from './TopBar';
import TransitionScreen from './TransitionScreen';
import GameSound from '../assets/sounds/game.wav';
import FiveSecSound from '../assets/sounds/fivesec.wav';
import Timer from './Timer';
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

const ImageContainer = styled.img``;

const ReferenceImage = ({source}) => {
  return <ImageContainer src={source}></ImageContainer>;
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

const DrawingBoard = ({imageUrl, color, setColor, canvasRef}) => {
  const [brushRadius, setBrushRadius] = React.useState(8);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    let image = new Image();
    image.src = imageUrl;
    image.onload = function () {
      setWidth(image.width);
      setHeight(image.height);
    };
  }, [imageUrl]);

  if (width === 0 || height === 0) {
    return null;
  }

  return (
    <DrawingContainer>
      <Container style={{flex: 1}}>
        <ReferenceImage source={imageUrl} />
      </Container>
      <Space width={40} />
      <VerticalBar />
      <Space width={40} />
      <Container style={{flex: 1}}>
        <CanvasDraw
          canvasWidth={width}
          canvasHeight={height}
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
  const [showTransition, setShowTransition] = React.useState(true);
  const [startTimer, setStartTimer] = React.useState(false);
  const [color, setColor] = React.useState(colors.black16);
  const [seconds, setSeconds] = React.useState(60);
  const [imageUrl, setImageUrl] = React.useState('');
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
        setImageUrl(player.data().imageLink);
      });
    setTimeout(() => {
      setShowTransition(false);
      setStartTimer(true);
    }, 2000);
  }, [gameId]);

  React.useEffect(() => {
    if (seconds === 0) {
      gameDoc
        .collection('drawings')
        .add({
          drawing: canvasRef.current.getSaveData(),
          playerId: playerId,
          imageLink: imageUrl,
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
      <TransitionScreen
        isVisible={showTransition}
        text={'Time to show off - replicate the left image!'}
      />
      <audio autoPlay loop ref={gameSoundTag} src={GameSound} />
      <audio ref={fiveSecSoundTag} src={FiveSecSound} />
      <TopBar text={'ROUND 1'} />
      <Timer seconds={seconds} setSeconds={setSeconds} startTimer={startTimer} />
      <DrawingBoard imageUrl={imageUrl} canvasRef={canvasRef} color={color} setColor={setColor} />
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
