import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//Screens (pages)
import TeamAccountPage from './pages/TeamAccountPage';

const ProtectedRoute = () => {
  //redirects
  const history = useHistory();

  //--side effects
  useEffect(() => {
    if (!localStorage.getItem('team')) history.push('/login');
    // console.log('ProtectedRoute: useEffect', state.user);
  });

  return <TeamAccountPage />;
};

export default ProtectedRoute;
