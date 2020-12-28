import React from 'react';
import CanvasDraw from 'react-canvas-draw';

const RefCanvasDraw = ({drawing}) => {
  const canvasRef = React.useRef();
  const drawingData = JSON.parse(drawing);
  const height = drawingData.height;
  const width = drawingData.width;
  React.useEffect(() => {
    canvasRef.current.loadSaveData(drawing, true);
  });
  return (
    <CanvasDraw
      style={{zIndex: 0}}
      ref={canvasRef}
      canvasHeight={height}
      canvasWidth={width}
      disabled
      hideInterface
      hideGrid
    />
  );
};

export default RefCanvasDraw;
