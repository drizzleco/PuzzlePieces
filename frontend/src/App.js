import React from 'react';
import Homepage from './components/Homepage';
import InitialApp from './components/InitialApp';
import GameRound from './components/GameRound';
import {Router} from '@reach/router';

const App = () => {
  return (
    <Router style={{height: '100%'}}>
      <Homepage path='/' />
      <InitialApp path='/old' />
      <GameRound path='/game/:roundID' />
    </Router>
  );
};

// URL round. /game/:gameID/:roundID
export default App;
