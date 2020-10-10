import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import firebaseConfig from './config/firebase';

firebase.initializeApp(firebaseConfig);

const dbh = firebase.firestore();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const alertNow = () => {
  dbh.collection('characters').doc('peach').set({
    employment: 'plumber',
    outfitColor: 'red',
    specialAttack: 'fireball',
  });
};

const App = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to PuzzlePieces!!</Text>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar />
      <Button onPress={alertNow} title='Cool button' color='#841584' />
    </View>
  );
};

export default App;
