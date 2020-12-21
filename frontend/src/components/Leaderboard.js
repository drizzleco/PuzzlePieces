import React from 'react';
import {Button, Row, Wrapper} from './style';
import dbh from '../firebase.js';
import TopBar, {TopBarDiv} from './TopBar';
import colors from '../colors';
import styled from 'styled-components';
import {navigate} from '@reach/router';
import Space from './Space';
import logo from '../assets/images/logo.svg';
import LeaderboardSound from '../assets/sounds/leaderboard.wav';
import _ from 'lodash';

const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const Logo = styled.img`
  height: 80px;
  background: radial-gradient(50% 50% at 50% 50%, #ffffff 16.52%, rgba(255, 255, 255, 0) 100%);
`;

const FinalImage = styled.img`
  width: 50%;
`;

const LeaderBoardContent = styled.div`
  width: 30%;
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
      <LeaderBoardText>{index + 1}</LeaderBoardText>
      <LeaderBoardText>{username}</LeaderBoardText>
      <LeaderBoardText>x</LeaderBoardText>
      <LeaderBoardText>{score * 50}</LeaderBoardText>
    </LeaderBoardRow>
  );
};

const getDrawingScores = async (gameDoc) => {
  let scoresMap = {};
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
    scoresMap[drawingId] = drawingScore;
  }
  return scoresMap;
};

const LeaderBoard = ({gameId}) => {
  const gameDoc = dbh.collection('game').doc(gameId);
  const [drawingScores, setDrawingScores] = React.useState({});
  const [bossImageLink, setBossImageLink] = React.useState('');

  React.useEffect(async () => {
    const drawingScoresMap = await getDrawingScores(gameDoc);
    setDrawingScores(drawingScoresMap);
    gameDoc.get().then((game) => {
      setBossImageLink(game.data().bossImageLink);
    });
  }, []);

  return (
    <Wrapper>
      <audio autoPlay loop src={LeaderboardSound} />
      <TopBar color={colors.orange1}>
        <Logo src={logo}></Logo>
      </TopBar>
      <Row>
        <LeaderBoardContent>
          <LeaderBoardWrapper>
            <LeaderBoardTitle>Leaderboard</LeaderBoardTitle>
            <LeaderBoardUsersContent>
              {Object.entries(drawingScores).map((tuple, index) => {
                const [drawingId, score] = tuple;
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
        <LeaderBoardContent>
          <FinalImage src={bossImageLink}></FinalImage>
        </LeaderBoardContent>
      </Row>
      <Row>
        <ContentButton onClick={() => navigate('/')}>Go Home</ContentButton>
      </Row>
      <Space height={10} />
    </Wrapper>
  );
};

export default LeaderBoard;
