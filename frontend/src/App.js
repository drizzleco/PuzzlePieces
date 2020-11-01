import React from 'react';
import InitialApp from './components/InitialApp';
import {Router} from '@reach/router';

const App = () => {
  return (
    <Router style={{height: '100%'}}>
      <InitialApp path='/' />
    </Router>
  );
};

export default App;
