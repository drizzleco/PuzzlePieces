import React from 'react';
import {Wrapper, Column, Row, Button} from './style';
import TopBar from './TopBar';
import styled from 'styled-components';
import colors from '../colors';
import Space from './Space';
import dbh from '../firebase.js';
import {navigate} from '@reach/router';
import {useCookies} from 'react-cookie';

const Label = styled.h1`
  font-family: Sniglet;
  font-size: 20px;
  width: 40%;
  text-align: left;
  color: ${colors.brown1};
`;

const SelectionButton = styled(Button)`
  background: ${(props) => (props.selected ? colors.orange1 : colors.white16)};
  border-radius: 4px;
  font-size: 20px;
  border: 1px solid ${(props) => (props.selected ? colors.orange1 : colors.black16)};
  color: ${(props) => (props.selected ? colors.white : colors.brown1)};
  min-width: 30px;
`;

const SelectionButtons = ({buttonValues, value, setValue}) => {
  const handleClick = (value) => {
    setValue(value);
  };

  return (
    <SelectionRow>
      {buttonValues.map((num) => {
        return (
          <>
            <SelectionButton key={num} onClick={() => handleClick(num)} selected={num === value}>
              {num}
            </SelectionButton>
            <Space width={20} />
          </>
        );
      })}
    </SelectionRow>
  );
};

const LabelColumn = styled(Column)`
  justify-content: space-around;
  align-items: flex-end;
  height: 100%;
`;

const SelectionColumn = styled(LabelColumn)`
  align-items: flex-start;
`;

const SelectionRow = styled(Row)`
  justify-content: flex-start;
`;

const CancelButton = styled(Button)`
  background: transparent;
  border: 1px solid ${colors.brown1};
  box-sizing: border-box;
  border-radius: 20px;
  color: ${colors.brown1};
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20%;
  height: 40px;
`;

const ConfirmButton = styled(CancelButton)`
  background: ${colors.purple3};
  color: ${colors.white16};
`;

const backToHome = () => {
  navigate('/');
};

const CreateGame = () => {
  const [cookies] = useCookies(['drawmaPlayerId', 'drawmaUsername', 'drawmaColor']);
  const [rounds, setRounds] = React.useState(3);
  const [seconds, setSeconds] = React.useState(30);
  const [players, setPlayers] = React.useState(5);
  const playerID = cookies.drawmaPlayerId;

  const createNewGame = () => {
    dbh
      .collection('game')
      .add({
        maxPlayers: players,
        rounds: rounds,
        state: 'WAITING',
        timePerRound: seconds,
        host: playerID,
      })
      .then((game) => {
        // add host to game
        dbh.collection('game').doc(game.id).collection('players').doc(playerID).set({
          username: cookies.drawmaUsername,
          color: cookies.drawmaColor,
        });
        navigate(`/game/${game.id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Wrapper>
      <TopBar text={'Settings'} />
      <Row>
        <Label style={{textAlign: 'center'}}>Customize your drawma below</Label>
      </Row>
      <Row style={{flex: 3}}>
        <LabelColumn>
          <Label>Rounds</Label>
          <Label>Seconds per round</Label>
          <Label>Max number of players</Label>
        </LabelColumn>
        <SelectionColumn>
          <SelectionButtons buttonValues={[1, 2, 3]} value={rounds} setValue={setRounds} />
          <SelectionButtons
            buttonValues={[30, 60, 90, 120]}
            value={seconds}
            setValue={setSeconds}
          />
          <SelectionButtons
            buttonValues={[2, 3, 4, 5, 6, 7, 8, 9]}
            value={players}
            setValue={setPlayers}
          />
        </SelectionColumn>
      </Row>
      <Row style={{flex: 2}}>
        <CancelButton onClick={backToHome}>Cancel</CancelButton>
        <Space width={200} />
        <ConfirmButton onClick={createNewGame}>Confirm</ConfirmButton>
      </Row>
    </Wrapper>
  );
};

export default CreateGame;
