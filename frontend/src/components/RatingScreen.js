import React from 'react';
import {Button, Row, Column, Wrapper} from './style';
import dbh from '../firebase.js';
import TopBar, {TopBarDiv} from './TopBar';
import colors from '../colors';
import styled from 'styled-components';
import {navigate, useParams} from '@reach/router';
import Space from './Space';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import CanvasDraw from 'react-canvas-draw';
import {useCookies} from 'react-cookie';
import RatingsSound from '../assets/sounds/ratings.mp3';

const NavButton = styled(Button)`
  border: 4px solid ${colors.purple3};
  border-radius: 8px;
  height: 50px;
  width: 50px;
  background-color: ${colors.white16};
`;

const RatingsBarBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(135, 93, 169, 0.7);
  border-radius: 44px;
  width: 50%;
  padding: 10px;
`;

const RatingsBar = ({
  buttonValues,
  docId,
  scores,
  setScores,
  value,
  setValue,
  playerId,
  isLastIndex,
  gameId,
}) => {
  const handleClick = (value) => {
    setValue(value);
    setScores({...scores, [docId]: value});
  };

  return (
    <RatingsBarBox>
      <RatingsBubbleWrapper>
        {buttonValues.map((num) => {
          return (
            <>
              <RatingsBubble
                key={`ratings-bubble-${num}`}
                onClick={() => handleClick(num)}
                selected={num === value}
              >
                {num}
              </RatingsBubble>
              <Space key={`space-${num}`} width={20} />
            </>
          );
        })}
        {isLastIndex && (
          <GoToLeaderBoardButton scores={scores} playerId={playerId} gameId={gameId} />
        )}
      </RatingsBubbleWrapper>
    </RatingsBarBox>
  );
};

const sendScores = ({scores, playerId, gameId}) => {
  const gameDoc = dbh.collection('game').doc(gameId);
  for (const [key, value] of Object.entries(scores)) {
    gameDoc
      .collection('drawings')
      .doc(key)
      .collection('scores')
      .add({
        [playerId]: value,
      });
  }
  navigate(`/game/${gameId}/leaderboard`);
};

const GoToLeaderBoardButton = ({scores, playerId, gameId}) => {
  console.log(gameId, 'leaderboard button gameId', gameId);
  return <Button onClick={() => sendScores({scores, playerId, gameId})}>Go to Leaderboard</Button>;
};

const Icon = styled(FontAwesomeIcon)`
  cursor: pointer;
  color: ${colors.purple3};
  font-size: 24px;
`;

const RatingsBubbleWrapper = styled(Row)``;

const RatingsBubble = styled(Button)`
  background: ${(props) => (props.selected ? colors.peach : colors.white16)};
  border-radius: 50%;
  font-size: 20px;
  border: 3px solid ${(props) => (props.selected ? colors.white16 : colors.peach)};
  color: ${(props) => (props.selected ? colors.white : colors.peach)};
  min-width: 40px;
  min-height: 40px;
`;

const Divider = styled.div`
  height: 50%;
  border-left: 6px solid ${colors.peach};
`;

const ImagePlaceholder = styled.img`
  width: 20%;
`;

const Text = styled.h1`
  font-family: Sniglet;
  font-size: 15px;
`;

const RefCanvasDraw = ({drawings, currentIndex}) => {
  const drawing = drawings[currentIndex];
  const canvasRef = React.useRef();
  React.useEffect(() => {
    canvasRef.current.loadSaveData(drawing, false);
  }, [drawing]);
  return <CanvasDraw ref={canvasRef} disabled hideInterface hideGrid />;
};

const RatingScreen = () => {
  const {gameId} = useParams();
  const [cookies] = useCookies(['drawmaPlayerId']);
  const [drawings, setDrawings] = React.useState([]);
  const [scores, setScores] = React.useState({});
  const [indexDocIdMap, setIndexDocIdMap] = React.useState({});
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [rating, setRating] = React.useState(0);
  const gameDoc = dbh.collection('game').doc(gameId);
  const playerId = cookies.drawmaPlayerId;

  React.useEffect(() => {
    gameDoc
      .collection('drawings')
      .get()
      .then((data) => {
        let values = [];
        let scores = {};
        let indexToDocId = {};
        let index = 0;
        data.forEach((doc) => {
          values.push(doc.data().drawing);
          scores[doc.id] = 0;
          indexToDocId[index] = doc.id;
          index += 1;
        });
        // doc.id upload later
        // drawing string for rendering
        // index to map from doc.id to an array
        setDrawings(values);
        setIndexDocIdMap(indexToDocId);
        setScores(scores);
        setCurrentIndex(0);
      });
  }, []);

  return (
    <Wrapper>
      <audio autoPlay loop src={RatingsSound} />
      <TopBar text={'Rate the drawings'} color={colors.orange1} />
      <Row style={{justifyContent: 'space-around'}}>
        <NavButton onClick={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}>
          <Icon icon={faChevronLeft}></Icon>
        </NavButton>
        <ImagePlaceholder src={'https://puzzlepieces-25386.web.app/airplane.png'} />
        <Divider />
        {drawings.length > 0 && <RefCanvasDraw drawings={drawings} currentIndex={currentIndex} />}
        <NavButton onClick={() => setCurrentIndex(Math.min(currentIndex + 1, drawings.length - 1))}>
          <Icon icon={faChevronRight}></Icon>
        </NavButton>
      </Row>
      <Row>
        <Column>
          <Text>Give a rating for each drawing</Text>
          <RatingsBar
            buttonValues={[1, 2, 3, 4, 5]}
            docId={indexDocIdMap[currentIndex]}
            scores={scores}
            setScores={setScores}
            value={scores[indexDocIdMap[currentIndex]]}
            setValue={setRating}
            isLastIndex={currentIndex == drawings.length - 1}
            playerId={playerId}
            gameId={gameId}
          />
          <Space height={20} />
        </Column>
      </Row>
    </Wrapper>
  );
};

export default RatingScreen;
