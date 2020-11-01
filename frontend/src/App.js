import React from 'react';
import InitialApp from './components/InitialApp';
import GameRound from './components/GameRound';
import {Router} from '@reach/router';

const App = () => {
  return (
    <Router style={{height: '100%'}}>
      <InitialApp path='/old' />
      <GameRound path='/game/:roundID' />
    </Router>
  );
};

// URL round. /game/:gameID/:roundID
export default App;
