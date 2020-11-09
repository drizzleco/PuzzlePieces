import React from 'react';
import {TopBarDiv, TopBarTitle} from './TopBar';
import {Wrapper, Row, Column, Button} from './style';
import CanvasDraw from 'react-canvas-draw';
import styled from 'styled-components';
import Space from './Space';
import colors from '../colors';
import lounge from '../assets/sounds/lounge.wav';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClone} from '@fortawesome/free-solid-svg-icons';

const Text = styled.h3`
  font-family: Sniglet;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0em;
  text-align: left;
`;

const TextDiv = styled.div``;

const StartButton = styled(Button)`
  width: 60%;
  height: 60px;
  background: ${colors.purple3};
  border-radius: 30px;
  color: ${colors.white16};
  font-size: 28px;
  font-weight: 400;
`;

const LeaveButton = styled(Button)`
  position: absolute;
  left: 20px;
  width: 80px;
  height: 50px;
  background: ${colors.orange1};
  border: 2px solid #ffffff;
  box-sizing: border-box;
  border-radius: 10px;
  font-size: 16px;
  color: #ffffff;
`;

const ShareBox = styled.div`
  width: 60%;
  height: 40px;
  border: 1px solid ${colors.orange1};
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CopyButton = styled.div`
  width: 10%;
  height: 40px;
  background: ${colors.tan2};
  color: ${colors.orange1};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0px 6px 6px 0px;
  cursor: pointer;
`;

const ShareText = styled.div`
  background: #faab93;
  font-size: 18px;
  color: ${colors.white16};
  font-family: Sniglet;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 6px 0px 0px 6px;
`;

const PlayerBubble = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  left: 64.93px;
  top: 272.99px;
  border-radius: 50%;
  border: 1.5px solid ${(props) => props.color};
  background: ${(props) => props.color};
  box-sizing: border-box;
  color: ${colors.white16};
  font-family: Sniglet;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 10px;
  letter-spacing: 0em;
  text-align: center;
`;

const WaitingRoom = ({gameDoc, game}) => {
  const [players, setPlayers] = React.useState([]);

  React.useEffect(() => {
    // Handles player updates
    const unsubscribe = gameDoc.collection('players').onSnapshot(
      (docs) => {
        let playersList = [];
        docs.forEach((player) => {
          playersList.push(player.data());
        });
        setPlayers(playersList);
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      },
    );
    return () => unsubscribe();
  }, [gameDoc]);

  return (
    <Wrapper>
      <audio autoPlay loop src={lounge} />
      <TopBarDiv>
        <LeaveButton>Leave Game</LeaveButton>
        <TopBarTitle>Artist Lounge</TopBarTitle>
      </TopBarDiv>
      <Row style={{height: '100%'}}>
        <Column style={{flex: 4}}>
          <ShareBox>
            <ShareText>Share:</ShareText>
            <Text>Some link text...</Text>
            <CopyButton>
              <FontAwesomeIcon icon={faClone} />
            </CopyButton>
          </ShareBox>
          <Space height={30} />
          <TextDiv>
            <Text>Rounds: {game.rounds}</Text>
            <Text>Time per round: {game.timePerRound} secs</Text>
            <Text>
              Players: {players.length}/{game.maxPlayers}
            </Text>
          </TextDiv>
          <Row>
            {players.map((player) => {
              return (
                <>
                  <PlayerBubble key={player.id} color={player.color}>
                    {player.username[0].toUpperCase()}
                  </PlayerBubble>
                  <Space width={10} />
                </>
              );
            })}
          </Row>
          <Space height={20} />
          <StartButton onClick={() => gameDoc.update({state: 'ROUND'})}>Start Game</StartButton>
        </Column>
        <Column style={{flex: 8}}>
          <Text style={{textDecoration: 'underline'}}>
            Get your creative juice flowing while you wait
          </Text>
          <CanvasDraw hideGrid lazyRadius={0} canvasWidth={800} />
        </Column>
      </Row>
    </Wrapper>
  );
};

export default WaitingRoom;
