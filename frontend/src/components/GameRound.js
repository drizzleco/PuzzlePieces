import React from 'react';
import {useParams} from '@reach/router';
import styled from 'styled-components';
import {HuePicker} from 'react-color';
import CanvasDraw from 'react-canvas-draw';
import colors from '../colors';
import Space from './Space';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUndoAlt, faStopwatch} from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  background-color: ${colors.yellow2};
`;

const Container = styled.div`
  display: flex;
`;

const TopBarDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${colors.yellow4};
  border-radius: 0px 0px 15px 15px;
`;

const TopBarTitle = styled.h1`
  font-family: Sniglet;
  font-weight: 400;
  color: ${colors.white16};
`;

const TopBar = ({text}) => {
  return (
    <TopBarDiv>
      <TopBarTitle>{text}</TopBarTitle>
    </TopBarDiv>
  );
};

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
`;

const SelectorSettings = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const DrawingBoard = ({color}) => {
  const canvas = React.createRef();
  const [brushRadius, setBrushRadius] = React.useState(12);

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
          ref={canvas}
          brushColor={color}
          brushRadius={brushRadius}
          canvasHeight={'100%'}
          canvasWidth={'100%'}
          hideGrid
        />
      </Container>
      <Space width={40} />
      <SelectorSettings>
        <SizeCircle width={'48px'} onClick={() => setBrushRadius(24)} />
        <SizeCircle width={'24px'} onClick={() => setBrushRadius(12)} />
        <SizeCircle width={'16px'} onClick={() => setBrushRadius(8)} />
        <FontAwesomeIcon icon={faUndoAlt} onClick={() => canvas.current.undo()} />
      </SelectorSettings>
    </DrawingContainer>
  );
};

const TimerDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const TimerText = styled.h2`
  font-family: Sniglet;
  font-size: 24px;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: 0em;
`;

const TimerBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const format = (seconds) => {
  let mins = Math.floor(seconds / 60);
  let secs = seconds % 60;
  return mins + ':' + (secs < 10 ? '0' + secs : secs);
};

const Timer = () => {
  const [seconds, setSeconds] = React.useState(60);

  React.useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    if (seconds === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <TimerDiv>
      <TimerBox>
        <FontAwesomeIcon icon={faStopwatch} />
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

const SliderPointer = styled.div``;

const GameRound = () => {
  const params = useParams();
  const [color, setColor] = React.useState();
  return (
    <Wrapper>
      <TopBar text={'ROUND 1'} />
      <Timer />
      <DrawingBoard color={color} />
      <HueContainer>
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
