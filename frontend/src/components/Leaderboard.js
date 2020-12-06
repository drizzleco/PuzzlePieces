import React from 'react';
import {Wrapper} from './style';
import TopBar from './TopBar';
import colors from '../colors';

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
    </Wrapper>
  );
};

export default LeaderBoard;
