import IntervalState from '@/types/IntervalState';
import React from 'react';

const IntervalStateContext = React.createContext<IntervalState>('all');

const useIntervalState = () => {
  const state = React.useContext(IntervalStateContext);

  return state;
};

export default useIntervalState;
export { IntervalStateContext };
