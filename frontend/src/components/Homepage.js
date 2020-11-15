import React from 'react';
import {Wrapper, Column, Row, Button} from './style';
import {TopBarDiv} from './TopBar';
import styled from 'styled-components';
import colors from '../colors';
import Space from './Space';
import dbh from '../firebase.js';
import {useCookies} from 'react-cookie';
import {navigate} from '@reach/router';
import home from '../assets/sounds/home.mp3';
import logo from '../assets/images/logo.svg';
import sound from '../assets/images/sound.svg';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faVolumeMute} from '@fortawesome/free-solid-svg-icons';
import {faVolumeUp} from '@fortawesome/free-solid-svg-icons';

const GetTheAppButton = styled(Button)`
  border: 3px solid ${colors.purple3};
  color: ${colors.purple3};
  background: ${colors.white16};
  box-sizing: border-box;
  border-radius: 18px;
  font-size: 30px;
  margin: 10px;
`;

const SoundButton = styled(Button)`
  cursor: pointer;
  position: absolute;
  top: 80px;
  right: 1%;
  background: none;
  font-size: 50px;
  color: ${colors.black16};
  box-shadow: none;
  transition: all 0.1s ease-in-out;

  &:hover {
    transform: scale(1.3);
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
`;

const PlayButton = styled(Button)`
  background: ${colors.purple3};
  font-size: 30px;
  width: 30%;
`;

const CreateGameButton = styled(PlayButton)`
  background: ${colors.yellow4};
  font-size: 30px;
  width: 30%;
`;

const AboutButton = styled(Button)`
  background: transparent;
  border: 1px solid ${colors.yellow4};
  color: ${colors.yellow4};
  font-size: 25px;
  width: 12%;
  position: absolute;
  bottom: 2%;
  left: 1%;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

const mutePage = (mute, setMute) => {
  // quick way to toggle mute on all audio tags on page
  setMute(!mute);
  Array.prototype.slice.call(document.querySelectorAll('audio')).forEach((audio) => {
    audio.muted = !mute;
  });
};

const changeName = (name, setName, color, setColor) => {
  if (color === colors.gray) setColor('#' + Math.floor(Math.random() * 16777215).toString(16));
  setName(name);
};

const saveUserToFirestore = (name, color, playerID, setCookie) => {
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
        setCookie('drawmaPlayerId', player.id, {path: '/'});
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const playGame = (name, color, playerID, cookies, setCookie) => {
  saveUserToFirestore(name, color, playerID, setCookie);
  // some logic here to handle find a game, etc
  // for now, join the 'test' game:
  dbh.collection('game').doc('test').collection('players').doc(cookies.drawmaPlayerId).set({
    username: name,
    color: color,
  });
  navigate('/game/test');
};

const Homepage = () => {
  const [name, setName] = React.useState('');
  const [mute, setMute] = React.useState(false);
  const [color, setColor] = React.useState(colors.gray);
  const [cookies, setCookie] = useCookies(['drawmaPlayerId']);
  const playerID = cookies.drawmaPlayerId;

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
      </TopBarDiv>
      <SoundButton onClick={() => mutePage(mute, setMute)}>
        <FontAwesomeIcon icon={mute ? faVolumeMute : faVolumeUp} />
      </SoundButton>
      <audio autoPlay loop src={home} />
      <MainColumn>
        <AboutButton>ABOUT</AboutButton>
        <Logo src={logo} />
        <NameBubble color={name ? color : colors.gray}>
          <NameInitial>{name ? name[0] : 'N'}</NameInitial>
        </NameBubble>
        <NameInput
          placeholder={'Enter Name'}
          value={name}
          onChange={(e) => changeName(e.target.value, setName, color, setColor)}
        />
        <HowToPlayButton>how to play</HowToPlayButton>
        <PlayButton onClick={() => playGame(name, color, playerID, cookies, setCookie)}>
          PLAY
        </PlayButton>
        <CreateGameButton>CREATE GAME</CreateGameButton>
      </MainColumn>
    </Wrapper>
  );
};

export default Homepage;
