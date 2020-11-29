import React from 'react';
import {navigate, useParams} from '@reach/router';
import dbh from '../firebase.js';
import GameRound from './GameRound';
import WaitingRoom from './WaitingRoom';
import {useCookies} from 'react-cookie';

const Game = () => {
  const {gameId} = useParams();
  const [game, setGame] = React.useState({state: 'WAITING'});
  const [loading, setLoading] = React.useState(true);
  const gameDoc = dbh.collection('game').doc(gameId);
  const [cookies, setCookie] = useCookies(['drawmaPlayerId']);
  const playerID = cookies.drawmaPlayerId;

  React.useEffect(() => {
    gameDoc.get().then((doc) => {
      // Load basic doc
      if (!doc.exists) {
        // game doesn't exist, boot back to homepage
        navigate('/');
        return;
      } else {
        // player not in game, so show the join screen
        if (!playerID) navigate('/', {state: {gameId: gameId}});
        else {
          gameDoc
            .collection('players')
            .doc(playerID)
            .get()
            .then((player) => {
              console.log(player.exists);
              if (!player.exists) navigate('/', {state: {gameId: gameId}});
            });
          setGame(doc.data());
          setLoading(false);
        }
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

  if (loading) {
    return null;
  } else {
    return game.state === 'ROUND' ? (
      <GameRound gameId={gameId} />
    ) : (
      <WaitingRoom gameDoc={gameDoc} game={game} />
    );
  }
};

export default Game;
