import React from 'react';
import {Button, Wrapper} from './style';
import dbh from '../firebase.js';
import TopBar from './TopBar';
import colors from '../colors';
import styled from 'styled-components';
import {navigate} from '@reach/router';
import Space from './Space';

const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const ImageContent = styled.div``;

const LeaderBoardContent = styled.div``;
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
  padding: 5px 10px;
`;

const LeaderBoardRow = styled.div`
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
  text-align: center;
`;

const ContentButton = styled(Button)`
  background-color: ${(props) => (props.backgroundColor ? props.backgroundColor : colors.yellow4)};
`;

const LeaderBoardUser = ({user}) => {
  return (
    <LeaderBoardRow>
      <LeaderBoardText>1</LeaderBoardText>
      <LeaderBoardText>Diana</LeaderBoardText>
      <LeaderBoardText>x</LeaderBoardText>
      <LeaderBoardText>300</LeaderBoardText>
    </LeaderBoardRow>
  );
};

const LeaderBoard = ({gameId}) => {
  const gameDoc = dbh.collection('game').doc(gameId);
  const [playerScores, setPlayerScores] = React.useState([]);

  React.useEffect(() => {
    gameDoc
      .collection('players')
      .get()
      .then((data) => {
        let values = [];
        data.forEach((doc) => {
          values.push(doc.data().score);
        });
        setPlayerScores(values);
      });
  });

  return (
    <Wrapper>
      <TopBar text={'Drawma'} color={colors.orange1} />
      <MainContent>
        <LeaderBoardContent>
          <LeaderBoardWrapper>
            <LeaderBoardTitle>Leaderboard</LeaderBoardTitle>
            <LeaderBoardUsersContent>
              {[1, 2, 3].map((num) => {
                return <LeaderBoardUser></LeaderBoardUser>;
              })}
            </LeaderBoardUsersContent>
          </LeaderBoardWrapper>
          <ContentButton onClick={() => navigate('/')}>Go Home</ContentButton>
        </LeaderBoardContent>
        <ImageContent>
          <ContentButton backgroundColor={colors.orange1}>Play Again</ContentButton>
        </ImageContent>
      </MainContent>
      <Space height={10} />
    </Wrapper>
  );
};

export default LeaderBoard;
