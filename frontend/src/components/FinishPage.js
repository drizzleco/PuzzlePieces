import React from 'react';
import CanvasDraw from 'react-canvas-draw';
import dbh from '../firebase.js';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RefCanvasDraw = ({drawing}) => {
  const canvasRef = React.useRef();
  React.useEffect(() => {
    canvasRef.current.loadSaveData(drawing, false);
  }, [drawing]);
  return <CanvasDraw ref={canvasRef} disabled hideInterface hideGrid />;
};

const FinishPage = ({gameId}) => {
  const gameDoc = dbh.collection('game').doc(gameId);
  const [savedData, setSavedData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    gameDoc
      .collection('drawings')
      .get()
      .then((data) => {
        let values = [];
        data.forEach((doc) => {
          values.push(doc.data().drawing);
        });
        setSavedData(values);
        setLoading(false);
      });
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      {savedData.map((drawing) => {
        return <RefCanvasDraw key={drawing.id} drawing={drawing} />;
      })}
    </Container>
  );
};

export default FinishPage;
