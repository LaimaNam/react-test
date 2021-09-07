import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { TeamContext } from '../App';
import styled from 'styled-components';

//styles
const HeaderStyled = styled.div`
  width: 100%;
  background-color: #3d5a80;
  color: #fff;

  header {
    display: flex;
    align-items: center;
    max-width: 1024px;
    margin: auto;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
  }

  ul {
    display: flex;
    gap: 10px;
    margin: 0;
  }

  li {
    list-style: none;
    padding: 15px 10px;
  }

  li:hover {
    background-color: #98c1d9;
  }

  a {
    text-decoration: none;
    color: #fff;
  }
`;

//component
const Header = () => {
  //Hooks
  // -- state
  const { state, dispatch } = useContext(TeamContext);

  //--side effects
  useEffect(() => {
    // console.log(localStorage.getItem('team'));
    if (localStorage.getItem('team')) {
      console.log('Team found');

      dispatch({
        type: 'LOGIN',
        payload: localStorage.getItem('team'),
      });
    } else {
      console.log('Team not found');
    }
  }, [dispatch]);

  return (
    <HeaderStyled>
      <header className="header">
        <div>BATTLENET</div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {state.team ? (
              <li>
                <Link to="/teamaccount">Team Account</Link>
              </li>
            ) : (
              <li>
                <Link to="/login">Login/Signup</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </HeaderStyled>
  );
};

export default Header;
