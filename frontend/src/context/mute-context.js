import React from 'react';

export const MuteContext = React.createContext({
  muted: false,
  toggleMuted: () => {},
});
