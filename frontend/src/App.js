import React from 'react';
import Homepage from './components/Homepage';
import Game from './components/Game';
import FinishPage from './components/FinishPage';
import InitialApp from './components/InitialApp';
import GameRound from './components/GameRound';
import CreateGame from './components/CreateGame';
import LeaderBoard from './components/Leaderboard';
import RatingScreen from './components/RatingScreen';
import AboutPage from './components/AboutPage';
import {Router} from '@reach/router';
import {MuteContext} from './context/mute-context';

const App = () => {
  const [muted, setMuted] = React.useState(false);
  const toggleMuted = () => {
    setMuted(!muted);
  };
  const mutedState = {muted, toggleMuted};
  return (
    <MuteContext.Provider value={mutedState}>
      <Router style={{height: '100%'}}>
        <Homepage path='/' />
        <InitialApp path='/old' />
        <CreateGame path='/game/create' />
        <Game path='/game/:gameId' />
        <FinishPage path='/game/:gameId/finished' />
        <GameRound path='/game/round/:roundID' />
        <LeaderBoard path='/game/:gameId/leaderboard' />
        <RatingScreen path='/game/:gameId/rating' />
        <AboutPage path='/about' />
      </Router>
    </MuteContext.Provider>
  );
};

// URL round. /game/:gameID/:roundID
export default App;
