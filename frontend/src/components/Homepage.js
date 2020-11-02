import React from 'react';
import {Wrapper, Row, Button} from './style';
import styled from 'styled-components';
import colors from '../colors';
import Space from './Space';
import dbh from '../firebase.js';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const NameBubble = styled(Row)`
  border-radius: 50%;
  width: 30vh;
  height: 30vh;
  background-color: ${(props) => props.color};
`;

const NameInitial = styled.h1`
  font-family: Sniglet;
  font-size: 70px;
  color: ${colors.white16};
`;

const NameInput = styled.input`
  background: transparent;
  width: 20vw;
  height: 10vh;
  border: 3px solid ${colors.yellow4};
  box-sizing: border-box;
  border-radius: 20px;
  transform: matrix(1, 0, 0, 1, 0, 0);
  outline: none;
  font-family: Sniglet;
  font-size: 36px;
  padding: 4px 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HowToPlayButton = styled(Button)`
  background: ${colors.orange1};
  font-size: 25px;
  width: 25%;
`;

const PlayButton = styled(Button)`
  font-size: 30px;
  width: 30%;
`;

const AboutButton = styled(Button)`
  background: transparent;
  border: 1px solid ${colors.yellow4};
  color: ${colors.yellow4};
  font-size: 20px;
  width: 10%;
  position: absolute;
  top: 2%;
  left: 1%;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

const Homepage = () => {
  const [name, setName] = React.useState('');
  const [color, setColor] = React.useState(colors.gray);
  const playerID = cookies.get('playerID');

  React.useEffect(() => {
    if (playerID) {
      dbh
        .collection('players')
        .doc(playerID)
        .get()
        .then((player) => {
          if (player.exists) {
            let data = player.data();
            setName(data.username);
            setColor(data.color);
          }
        });
    }
  }, []);

  const changeName = (name) => {
    if (color === colors.gray) setColor('   ' + Math.floor(Math.random() * 16777215).toString(16));
    setName(name);
  };

  const saveUserToFirestore = () => {
    if (!name) return;
    let data = {
      username: name,
      color: color,
    };
    if (playerID) {
      // if user object exists, overwrite username
      dbh.collection('players').doc(playerID).set(data);
    } else {
      // save new user to db
      dbh
        .collection('players')
        .add(data)
        .then((player) => {
          cookies.set('playerID', player.id, {path: '/'});
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Wrapper>
      <AboutButton>ABOUT</AboutButton>
      <Row>
        <h1>Logo</h1>
      </Row>
      <Row>
        <NameBubble color={color}>
          <NameInitial>{name[0]}</NameInitial>
        </NameBubble>
        <Space width={17} />
        <NameInput placeholder={'Name'} value={name} onChange={(e) => changeName(e.target.value)} />
      </Row>
      <ButtonContainer>
        <HowToPlayButton>HOW TO PLAY</HowToPlayButton>
        <Space height={20} />
        <Row>
          <PlayButton>CREATE GAME</PlayButton>
          <Space width={20} />
          <PlayButton onClick={saveUserToFirestore}>PLAY</PlayButton>
        </Row>
      </ButtonContainer>
    </Wrapper>
  );
};

export default Homepage;
