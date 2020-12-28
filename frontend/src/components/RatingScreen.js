import React from 'react';
import {Button, Row, Column, Wrapper} from './style';
import dbh from '../firebase.js';
import TopBar from './TopBar';
import colors from '../colors';
import styled from 'styled-components';
import {navigate, useParams} from '@reach/router';
import Space from './Space';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {useCookies} from 'react-cookie';
import RatingsSound from '../assets/sounds/ratings.mp3';
import Timer from './Timer';
import RefCanvasDraw from './RefCanvasDraw';
import TransitionScreen from './TransitionScreen';

const NavButton = styled(Button)`
  border: 4px solid ${colors.purple3};
  border-radius: 8px;
  height: 50px;
  width: 50px;
  background-color: ${colors.white16};
`;

const ProgressBox = styled.div`
  width: 48px;
  background: ${colors.purple3};
  border: 3px solid ${colors.yellow4};
  border-radius: 0px 0px 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -13px;
`;

const ProgressBoxText = styled.h2`
  font-family: Sniglet;
  font-size: 15px;
  color: ${colors.white16};
  padding: 5px;
  margin: 0;
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
  nextImage,
  isLastIndex,
  gameId,
}) => {
  const handleClick = (value) => {
    setValue(value);
    setScores({...scores, [docId]: value});
    setTimeout(nextImage, 250); // affirm selection happen
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

const ImagePlaceholder = styled.img``;

const Text = styled.h1`
  font-family: Sniglet;
  font-size: 15px;
`;

const RatingScreen = () => {
  const {gameId} = useParams();
  const [showTransition, setShowTransition] = React.useState(true);
  const [startTimer, setStartTimer] = React.useState(false);
  const [cookies] = useCookies(['drawmaPlayerId']);
  const [drawings, setDrawings] = React.useState([]);
  const [originalImageLinks, setOriginalImageLinks] = React.useState([]);
  const [scores, setScores] = React.useState({});
  const [indexDocIdMap, setIndexDocIdMap] = React.useState({});
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [rating, setRating] = React.useState(0);
  const [seconds, setSeconds] = React.useState(30);
  const gameDoc = dbh.collection('game').doc(gameId);
  const playerId = cookies.drawmaPlayerId;

  React.useEffect(() => {
    gameDoc
      .collection('drawings')
      .get()
      .then((data) => {
        let drawings = [];
        let originalImageLinks = [];
        let scores = {};
        let indexToDocId = {};
        let index = 0;
        data.forEach((doc) => {
          drawings.push(doc.data().drawing);
          originalImageLinks.push(doc.data().imageLink);
          scores[doc.id] = 0;
          indexToDocId[index] = doc.id;
          index += 1;
        });
        setTimeout(() => {
          setShowTransition(false);
          setStartTimer(true);
        }, 2000);
        // doc.id upload later
        // drawing string for rendering
        // index to map from doc.id to an array
        setDrawings(drawings);
        setOriginalImageLinks(originalImageLinks);
        setIndexDocIdMap(indexToDocId);
        setScores(scores);
        setCurrentIndex(0);
      });
  }, []);

  React.useEffect(() => {
    if (seconds === 0) {
      sendScores({scores, playerId, gameId});
    }
  });

  return (
    <Wrapper>
      <TransitionScreen
        isVisible={showTransition}
        text={'Stir UP that drama - it’s judging time'}
      />
      <audio autoPlay loop src={RatingsSound} />
      <TopBar text={'Rate the drawings'} color={colors.orange1} />
      <Row>
        <Column>
          <Timer seconds={seconds} setSeconds={setSeconds} startTimer={startTimer} />
          <ProgressBox>
            <ProgressBoxText>
              {currentIndex + 1} of {drawings.length}
            </ProgressBoxText>
          </ProgressBox>
        </Column>
      </Row>
      <Row style={{justifyContent: 'space-around'}}>
        <NavButton onClick={() => setCurrentIndex(Math.max(currentIndex - 1, 0))}>
          <Icon icon={faChevronLeft}></Icon>
        </NavButton>
        <ImagePlaceholder src={originalImageLinks[currentIndex]} />
        <Divider />
        {drawings.length > 0 && <RefCanvasDraw drawing={drawings[currentIndex]} />}
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
            nextImage={() => setCurrentIndex(Math.min(currentIndex + 1, drawings.length - 1))}
            isLastIndex={currentIndex === drawings.length - 1}
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
