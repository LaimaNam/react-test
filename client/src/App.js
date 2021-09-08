import React, { useReducer } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//Screens (pages)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';

//Components
import Header from './components/Header';

//CONTEXT
export const TeamContext = React.createContext();

//STATE MANAGEMENT
// - - global
const initialState = {
  team: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'REGISTER':
      return { team: action.payload }; // action.payload - atsiustas id vartotojo
    case 'LOGIN':
      return { team: action.payload }; // action.payload - atsiustas id vartotojo
    case 'LOGOUT':
      return { team: '' };
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
