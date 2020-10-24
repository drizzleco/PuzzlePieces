import logo from './logo.svg';
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
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <CanvasDraw />
        <button onClick={alertNow}></button>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
