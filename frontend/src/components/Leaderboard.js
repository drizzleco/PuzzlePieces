import React from 'react';
import {Button, Row, Wrapper} from './style';
import dbh from '../firebase.js';
import TopBar from './TopBar';
import TransitionScreen from './TransitionScreen';
import colors from '../colors';
import styled from 'styled-components';
import {navigate} from '@reach/router';
import Space from './Space';
import logo from '../assets/images/logo.svg';
import LeaderboardSound from '../assets/sounds/leaderboard.wav';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {faMeh} from '@fortawesome/free-regular-svg-icons';
import CanvasDraw from 'react-canvas-draw';
import _ from 'lodash';

const Logo = styled.img`
  height: 80px;
  background: radial-gradient(50% 50% at 50% 50%, #ffffff 16.52%, rgba(255, 255, 255, 0) 100%);
`;

const FinalImage = styled.img`
  /* width: 50%; */
`;

const LeaderBoardContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LeaderBoardUsersContent = styled.div``;

const LeaderBoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${colors.gray5};
  background: ${colors.white16};
`;

const LeaderBoardTitle = styled.h2`
  font-family: Sniglet;
  color: ${colors.white16};
  font-size: 24px;
  display: flex;
  text-align: center;
  background: ${colors.purple3};
  margin: 0;
  padding: 5px 30px;
  border-radius: 3px;
`;

const LeaderBoardRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const LeaderBoardText = styled.h1`
  font-family: Sniglet;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0em;
`;

const ContentButton = styled(Button)`
  width: 30%;
  height: 40px;
  font-size: 24px;
  background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : colors.yellow4)};
`;

const StarsWrapper = styled.div`
  width: 20%;
  display: flex;
  align-items: center;
`;

const StarIcon = styled(FontAwesomeIcon)`
  color: ${colors.yellow4};
  font-size: 12px;
`;

const Stars = ({place}) => {
  const winners = [3, 2, 1];

  return (
    <StarsWrapper>
      {place < 3 ? (
        [...Array(winners[place])].map(() => {
          return <StarIcon icon={faStar}></StarIcon>;
        })
      ) : (
        <FontAwesomeIcon icon={faMeh} style={{fontSize: '12px'}} />
      )}
    </StarsWrapper>
  );
};

const ScrollView = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 1200px;
  overflow-y: scroll;
`;

const LeaderBoardUser = ({drawingId, gameDoc, score, index}) => {
  const [username, setUsername] = React.useState();
  React.useEffect(async () => {
    const drawing = await gameDoc.collection('drawings').doc(drawingId).get();
    const playerId = drawing.data().playerId;
    if (playerId) {
      const person = await gameDoc.collection('players').doc(playerId).get();
      setUsername(person.data().username);
    }
  }, [drawingId]);
  return (
    <LeaderBoardRow>
      <LeaderBoardText>{index + 1}.</LeaderBoardText>
      <LeaderBoardText>{username}</LeaderBoardText>
      <LeaderBoardText>x</LeaderBoardText>
      <LeaderBoardText>{score * 50}</LeaderBoardText>
      <Stars place={index} />
    </LeaderBoardRow>
  );
};

const Container = styled.div`
  display: flex;
  flex: 1;
`;

const CombinedImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
`;

const RefCanvasDraw = ({drawing}) => {
  const canvasRef = React.useRef();
  const drawingData = JSON.parse(drawing);
  const height = drawingData.height;
  const width = drawingData.width;

  React.useEffect(() => {
    canvasRef.current.loadSaveData(drawing, true);
  });

  return (
    <CanvasDraw
      style={{display: 'flex', zIndex: 0}}
      canvasWidth={width}
      canvasHeight={height}
      ref={canvasRef}
      disabled
      hideInterface
      hideGrid
    />
  );
};

const CombinedImage = ({gameId}) => {
  const [drawings, setDrawings] = React.useState(null);
  const [rows, setRows] = React.useState(null);
  const [columns, setColumns] = React.useState(null);
  // const numCanvases = rows * columns;

  const gameDoc = dbh.collection('game').doc(gameId);
  const drawingsCollection = dbh.collection('game').doc(gameId).collection('drawings');

  React.useEffect(() => {
    gameDoc.get().then((game) => {
      let data = game.data();
      setRows(data.rows);
      setColumns(data.columns);
    });
  }, [gameId]);

  React.useEffect(() => {
    drawingsCollection.get().then((drawings) => {
      let tempDrawings = {};
      drawings.forEach((drawing) => {
        let drawingData = drawing.data();
        let splits = drawingData.imageLink.split('/');
        let index = parseInt(splits[splits.length - 1].split('.')[0], 10);
        tempDrawings[index] = drawingData.drawing;
      });
      setDrawings(tempDrawings);
    });
  }, [gameId]);

  if (drawings === null || columns === null || rows === null) {
    return null;
  }

  return (
    <CombinedImageContainer>
      {[...Array(rows)].map((rowVal, rowIndex) => {
        return (
          <Row style={{height: '100%'}}>
            {[...Array(columns)].map((colVal, colIndex) => {
              let index = rowIndex * columns + colIndex;
              return <RefCanvasDraw drawing={drawings[index]} />;
            })}
          </Row>
        );
      })}
    </CombinedImageContainer>
  );
};

const getDrawingScores = async (gameDoc) => {
  let scoresList = [];
  const drawings = await gameDoc.collection('drawings').get();
  let drawingIds = [];
  drawings.forEach((drawing) => {
    drawingIds.push(drawing.id);
  });
  for (const drawingId of drawingIds) {
    let allScores = [];
    let drawingScore = 0;
    const scores = await gameDoc.collection('drawings').doc(drawingId).collection('scores').get();
    scores.forEach((score) => {
      allScores.push(score.data());
    });
    drawingScore = _.sum(_.values(_.reduce(allScores, _.extend)));
    scoresList.push({[drawingId]: drawingScore});
  }
  return scoresList;
};

const LeaderBoard = ({gameId}) => {
  const gameDoc = dbh.collection('game').doc(gameId);
  const [drawingScores, setDrawingScores] = React.useState([]);
  const [bossImageLink, setBossImageLink] = React.useState('');
  const [showTransition, setShowTransition] = React.useState(true);

  React.useEffect(async () => {
    const drawingScoresMaps = await getDrawingScores(gameDoc);
    drawingScoresMaps.sort(function (a, b) {
      return Object.values(b)[0] - Object.values(a)[0];
    });
    setDrawingScores(drawingScoresMaps);
    gameDoc.get().then((game) => {
      setBossImageLink(game.data().bossImageLink);
    });
    setTimeout(() => setShowTransition(false), 2000);
  }, []);

  return (
    <Wrapper>
      <TransitionScreen visible={showTransition} text={'Ready to see y’all’s creation?'} />
      <audio autoPlay loop src={LeaderboardSound} />
      <TopBar color={colors.orange1}>
        <Logo src={logo}></Logo>
      </TopBar>
      <Space height={10} />
      <Row>
        <LeaderBoardContent>
          <LeaderBoardWrapper>
            <LeaderBoardTitle>Leaderboard</LeaderBoardTitle>
            <LeaderBoardUsersContent>
              {drawingScores.map((scoreObj, index) => {
                const [drawingId, score] = Object.entries(scoreObj)[0];
                return (
                  <LeaderBoardUser
                    key={drawingId}
                    index={index}
                    gameDoc={gameDoc}
                    drawingId={drawingId}
                    score={score}
                  ></LeaderBoardUser>
                );
              })}
            </LeaderBoardUsersContent>
          </LeaderBoardWrapper>
        </LeaderBoardContent>
        <Space width={40} />
      </Row>
      <Space height={10} />
      <Row>
        <LeaderBoardContent>
          <FinalImage src={bossImageLink}></FinalImage>
        </LeaderBoardContent>
        <Space width={100} />
        <LeaderBoardContent>
          <CombinedImage gameId={gameId} />
        </LeaderBoardContent>
      </Row>
      <Space height={10} />
      <Row>
        <ContentButton onClick={() => navigate('/')}>Go Home</ContentButton>
      </Row>
      <Space height={10} />
    </Wrapper>
  );
};

export default LeaderBoard;
