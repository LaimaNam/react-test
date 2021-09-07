import React, { useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

//Screens (pages)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';

//Components
import Header from './components/Header';

//CONTEXT
export const TeamContext = React.createContext();

// -- API URL
const GET_TEAMS_URI = 'http://localhost:5000/api/teams';
const GET_VOTES_URI = 'http://localhost:5000/api/votes/';

//STATE MANAGEMENT
// - - global
const initialState = {
  team: '',
  votes: [],
  teams: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'REGISTER':
      return { ...state, team: action.payload }; // action.payload - atsiustas id vartotojo
    case 'LOGIN':
      return { ...state, team: action.payload }; // action.payload - atsiustas id vartotojo
    case 'LOGOUT':
      return { ...state, team: '' };

    default:
      return state;
  }
};

function App() {
  //HOOKS
  // -- state
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <TeamContext.Provider value={{ state, dispatch }}>
        <Router>
          <Header />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/teamaccount" component={ProtectedRoute} />
          </Switch>
        </Router>
      </TeamContext.Provider>
    </>
  );
}

export default App;
