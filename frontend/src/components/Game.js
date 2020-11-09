import React from 'react';
import {navigate, useParams} from '@reach/router';
import dbh from '../firebase.js';
import GameRound from './GameRound';
import WaitingRoom from './WaitingRoom';

const Game = () => {
  const {gameId} = useParams();
  const [game, setGame] = React.useState({state: 'WAITING'});
  const [loading, setLoading] = React.useState(false);
  const gameDoc = dbh.collection('game').doc(gameId);

  React.useEffect(() => {
    gameDoc.get().then((doc) => {
      // Load basic doc
      if (!doc.exists) {
        navigate('/');
      } else {
        setGame(doc.data());
        setLoading(true);
      }
    });
  }, [gameId]);

  React.useEffect(() => {
    // Handles game snapshot updates
    const unsubscribe = gameDoc.onSnapshot(
      (docSnapshot) => {
        setGame(docSnapshot.data());
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      },
    );
    return () => unsubscribe();
  }, [gameId]);

  if (!loading) {
    return null;
  }
  return game.state === 'ROUND' ? (
    <GameRound gameId={gameId} />
  ) : (
    <WaitingRoom gameDoc={gameDoc} game={game} />
  );
};

export default Game;
