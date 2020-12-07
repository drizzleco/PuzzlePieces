import React from 'react';
import {faVolumeMute} from '@fortawesome/free-solid-svg-icons';
import {faVolumeUp} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {MuteContext} from '../context/mute-context';
import styled from 'styled-components';
import {Button} from './style';
import colors from '../colors';

const ButtonWrapper = styled(Button)`
  /* position: absolute;
  right: 1%; */
  cursor: pointer;
  background: none;
  font-size: 50px;
  color: ${colors.black16};
  box-shadow: none;
  transition: all 0.1s ease-in-out;

  &:hover {
    transform: scale(1.3);
  }
`;

const mutePage = (muted) => {
  // quick way to toggle mute on all audio tags on page
  Array.prototype.slice.call(document.querySelectorAll('audio')).forEach((audio) => {
    audio.muted = muted;
  });
};

const SoundButton = () => {
  const mutedContext = React.useContext(MuteContext);

  React.useEffect(() => {
    mutePage(mutedContext.muted);
  }, [mutedContext.muted]);

  return (
    <MuteContext.Consumer>
      {({toggleMuted}) => (
        <ButtonWrapper onClick={toggleMuted}>
          <FontAwesomeIcon icon={mutedContext.muted ? faVolumeMute : faVolumeUp} />
        </ButtonWrapper>
      )}
    </MuteContext.Consumer>
  );
};

export default SoundButton;
