import React from 'react';
import Homepage from './components/Homepage';
import Game from './components/Game';
import FinishPage from './components/FinishPage';
import InitialApp from './components/InitialApp';
import GameRound from './components/GameRound';
import {Router} from '@reach/router';

const App = () => {
  return (
    <Router style={{height: '100%'}}>
      <Homepage path='/' />
      <InitialApp path='/old' />
      <Game path='/game/:gameId' />
      <FinishPage path='/game/:gameId/finished' />
      <GameRound path='/game/round/:roundID' />
    </Router>
  );
};

// URL round. /game/:gameID/:roundID
export default App;
