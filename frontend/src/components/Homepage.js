import React from 'react';
import {Wrapper, Column, Row, Button, ErrorMessage} from './style';
import {TopBarDiv} from './TopBar';
import styled from 'styled-components';
import colors from '../colors';
import dbh from '../firebase.js';
import {useCookies} from 'react-cookie';
import {navigate} from '@reach/router';
import HomeSound from '../assets/sounds/home.mp3';
import logo from '../assets/images/logo.svg';
import SoundButton from './SoundButton';

const GetTheAppButton = styled(Button)`
  border: 3px solid ${colors.purple3};
  color: ${colors.purple3};
  background: ${colors.white16};
  box-sizing: border-box;
  border-radius: 18px;
  font-size: 30px;
  margin: 10px;
  &:hover {
    box-shadow: 0px 4px 12px ${colors.purple10};
  }
`;

const Logo = styled.img`
  height: 30vh;
  margin-top: -8vh;
`;

const NameBubble = styled(Row)`
  border-radius: 50%;
  width: 20vh;
  height: 20vh;
  background-color: ${(props) => props.color};
`;

const NameInitial = styled.h1`
  font-family: Sniglet;
  font-size: 10vh;
  color: ${colors.white16};
`;

const NameInput = styled.input`
  background: transparent;
  width: 30%;
  text-align: center;
  border: 3px solid ${colors.yellow4};
  box-sizing: border-box;
  border-radius: 20px;
  transform: matrix(1, 0, 0, 1, 0, 0);
  outline: none;
  font-family: Sniglet;
  font-size: 36px;
  padding: 4px 20px;
  background: ${colors.white16};
`;

const MainColumn = styled(Column)`
  height: 100%;
  justify-content: space-around;
`;

const HowToPlayButton = styled(Button)`
  background: ${colors.orange1};
  font-size: 25px;
  width: 20%;
  background: ${colors.white16};
  border: 3px solid ${colors.orange1};
  box-sizing: border-box;
  box-shadow: 0px 4px 12px ${colors.orange1};
  border-radius: 20px;
  color: ${colors.orange1};
  position: absolute;
  bottom: 2%;
  right: 1%;
  &:hover {
    background: ${colors.orange1};
    border: 3px solid ${colors.white16};
    color: ${colors.white16};
  }
`;

const PlayButton = styled(Button)`
  background: ${colors.purple3};
  font-size: 30px;
  width: 30%;
  &:hover {
    background: ${colors.purple10};
  }
`;

const CreateGameButton = styled(PlayButton)`
  background: ${colors.yellow4};
  font-size: 30px;
  width: 30%;
  &:hover {
    background: ${colors.orange1};
  }
`;

const AboutButton = styled.h1`
  color: ${colors.yellow4};
  font-family: Sniglet;
  font-size: 25px;
  font-weight: 400;
  position: absolute;
  bottom: 2%;
  left: 1%;
  text-decoration-line: underline;
  cursor: pointer;
  &:hover {
    color: ${colors.purple3};
  }
`;

const changeName = (name, setName, color, setColor) => {
  if (color === colors.gray) setColor('#' + Math.floor(Math.random() * 16777215).toString(16));
  setName(name);
};

const saveUserToFirestore = (name, color, playerID, setPlayerID, setCookie) => {
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
        setCookie('drawmaPlayerId', player.id, {path: '/'});
        setPlayerID(player.id);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  setCookie('drawmaUsername', name, {path: '/'});
  setCookie('drawmaColor', color, {path: '/'});
};

const createGame = (
  name,
  color,
  playerID,
  setPlayerID,
  cookies,
  setCookie,
  nameError,
  setNameError,
) => {
  if (!name) {
    setNameError(true);
    return;
  }
  saveUserToFirestore(name, color, playerID, setPlayerID, setCookie);
  navigate('/game/create');
};

const playGame = (
  name,
  color,
  playerID,
  setPlayerID,
  cookies,
  setCookie,
  setNameError,
  setGameError,
  gameId,
) => {
  if (!name) {
    setNameError(true);
    return;
  }
  if (!gameId) {
    // logic here for handling public game finding
    return;
  }
  saveUserToFirestore(name, color, playerID, setPlayerID, setCookie);
  dbh
    .collection('game')
    .doc(gameId)
    .get()
    .then((game) => {
      if (game.data().state !== 'WAITING') {
        // game already started
        setGameError(true);
      } else {
        // join game
        console.log(playerID);
        dbh.collection('game').doc(gameId).collection('players').doc(playerID).set({
          username: name,
          color: color,
        });
        // redirect to game page
        navigate(`/game/${gameId}`);
      }
    });
};

const Homepage = ({location}) => {
  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [gameError, setGameError] = React.useState(false);
  const [color, setColor] = React.useState(colors.gray);
  const [cookies, setCookie] = useCookies(['drawmaPlayerId']);
  const [playerID, setPlayerID] = React.useState(cookies.drawmaPlayerId);
  const gameId = location.state ? location.state.gameId : false;

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
  }, [playerID]);

  return (
    <Wrapper>
      <TopBarDiv style={{justifyContent: 'flex-end'}}>
        <GetTheAppButton>Get the App</GetTheAppButton>
        <SoundButton />
      </TopBarDiv>
      <audio autoPlay loop src={HomeSound} />
      <MainColumn>
        <AboutButton>About the creators</AboutButton>
        <Logo src={logo} />
        <NameBubble color={name ? color : colors.gray}>
          <NameInitial>{name ? name[0] : 'N'}</NameInitial>
        </NameBubble>
        <NameInput
          placeholder={'Enter Name'}
          value={name}
          onChange={(e) => changeName(e.target.value, setName, color, setColor)}
        />
        {nameError && (
          <ErrorMessage>you’re not allowed to ghost in, please type your name</ErrorMessage>
        )}
        <HowToPlayButton>how to play</HowToPlayButton>
        <PlayButton
          onClick={() =>
            playGame(
              name,
              color,
              playerID,
              setPlayerID,
              cookies,
              setCookie,
              setNameError,
              setGameError,
              gameId,
            )
          }
        >
          PLAY
        </PlayButton>
        {!gameId && (
          <CreateGameButton
            onClick={() =>
              createGame(
                name,
                color,
                playerID,
                setPlayerID,
                cookies,
                setCookie,
                nameError,
                setNameError,
              )
            }
          >
            CREATE GAME
          </CreateGameButton>
        )}
        {gameError && (
          <ErrorMessage>
            you’re too fashionably late<br></br>game’s already begun or is no longer valid
          </ErrorMessage>
        )}
      </MainColumn>
    </Wrapper>
  );
};

export default Homepage;
