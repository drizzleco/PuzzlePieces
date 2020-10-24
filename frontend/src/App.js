import React from 'react';
import './App.css';
import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from './firebaseConfig.js';
import CanvasDraw from 'react-canvas-draw';

firebase.initializeApp(firebaseConfig);

const dbh = firebase.firestore();

const alertNow = () => {
  dbh.collection('characters').doc('luigi').set({
    employment: 'dude',
    outfitColor: 'red',
    specialAttack: 'fireball',
  });
};

function App() {
  const canvas = React.createRef();
  const canvas2 = React.createRef();
  const [drawData, setDrawData] = React.useState();

  const getSave = () => {
    const stringObject = canvas.current.getSaveData();
    setDrawData(stringObject);
  };

  const populate = () => {
    canvas2.current.loadSaveData(drawData, true);
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h6>Drawma</h6>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <CanvasDraw ref={canvas} />
          <div style={{minWidth: '100px'}} />
          <CanvasDraw ref={canvas2} />
        </div>
        <button onClick={alertNow}>send firebase ex</button>
        <button onClick={getSave}>log drawing save</button>
        <button onClick={populate}>populate saved drawing</button>
      </header>
    </div>
  );
}

export default App;
