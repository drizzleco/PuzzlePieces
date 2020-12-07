import React from 'react';
import {Button, Row, Wrapper} from './style';
import dbh from '../firebase.js';
import TopBar, {TopBarDiv} from './TopBar';
import colors from '../colors';
import styled from 'styled-components';
import {navigate} from '@reach/router';
import Space from './Space';
import logo from '../assets/images/logo.svg';
import SoundButton from './SoundButton';

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
const LeaderBoardUsersContent = styled.div`
  width: 30%;
`;

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
  width: 30%;
  height: 40px;
  font-size: 24px;
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
      <TopBar color={colors.orange1}>
        <Logo src={logo}></Logo>
      </TopBar>
      <Row>
        <LeaderBoardContent>
          <LeaderBoardWrapper>
            <LeaderBoardTitle>Leaderboard</LeaderBoardTitle>
            <LeaderBoardUsersContent>
              {[1, 2, 3].map((num) => {
                return <LeaderBoardUser></LeaderBoardUser>;
              })}
            </LeaderBoardUsersContent>
          </LeaderBoardWrapper>
        </LeaderBoardContent>
        <Space width={40} />
        <LeaderBoardContent>
          <FinalImage src={'https://puzzlepieces-25386.web.app/airplane.png'}></FinalImage>
        </LeaderBoardContent>
      </Row>
      <Row>
        <ContentButton onClick={() => navigate('/')}>Go Home</ContentButton>
        <Space width={40} />
        <ContentButton backgroundColor={colors.orange1}>Play Again</ContentButton>
      </Row>
      <Space height={10} />
    </Wrapper>
  );
};

export default LeaderBoard;
