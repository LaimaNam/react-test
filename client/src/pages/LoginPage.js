import React, { useState, useContext, useRef } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import { TeamContext } from '../App';
import styled from 'styled-components';

const FormsStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    letter-spacing: 1px;
    font-weight: 500;
    margin: 15px 0;
  }

  form {
    width: 300px;
  }

  form div {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  form label {
    text-align: left;
  }

  form input {
    padding: 7px;
  }

  form input[type='submit'] {
    margin-top: 10px;
    letter-spacing: 1px;
    font-weight: bold;
    border: none;
    transition: 0.3s;
    background-color: #98c1d9;
    color: #fff;
  }

  form input[type='submit']:hover {
    background-color: #3d5a80;
    cursor: pointer;
  }

  .signUpMessage,
  .loginMessage {
    margin: 15px 0;
    padding-left: 5px;
    border-left: 10px solid #3d5a80;
  }
`;

const LoginPage = () => {
  //Hooks
  //global
  const { dispatch } = useContext(TeamContext);
  //local
  // -- login form local state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPasword, setLoginPasword] = useState('');
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  // -- sign up form local state
  const [signupTeamImage, setSignupTeamImage] = useState('');
  const [signupTeamTitle, setSignupTeamTitle] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupErrorMessage, setSignupErrorMessage] = useState('');

  // -- refs
  const inputRef = useRef();
  const signupPasswordInputRef = useRef();
  const signupEmailInputRef = useRef();

  // -- redirects
  const history = useHistory();

  //custom functions
  const loginTeam = (e) => {
    e.preventDefault();
    console.log(loginEmail, loginPasword);

    axios
      .post('https://ca-react-test.herokuapp.com/api/teams/login', {
        email: loginEmail,
        password: loginPasword,
      })
      .then((response) => {
        const id = response.data.teamId;
        localStorage.setItem('team', id);
        dispatch({ type: 'LOGIN', payload: id });
        history.push('/teamaccount');
      })
      .catch((error) => {
        setLoginEmail('');
        setLoginPasword('');
        // Handle error.
        setLoginErrorMessage(error.response.data.message);
        inputRef.current.focus();
      });
  };

  const signupTeam = (e) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      setSignupErrorMessage('Passwords do not match');
      setSignupPassword('');
      setSignupConfirmPassword('');

      signupPasswordInputRef.current.focus();

      return;
    }

    axios
      .post('https://ca-react-test.herokuapp.com/signup', {
        image: signupTeamImage,
        title: signupTeamTitle,
        email: signupEmail,
        password: signupPassword,
      })
      .then((response) => {
        if (response.data.registrationStatus === 'failed') {
          setSignupErrorMessage(response.data.message);
          setSignupEmail('');
          setSignupPassword('');
          setSignupConfirmPassword('');
          signupEmailInputRef.current.focus();
        } else if (response.data.registrationStatus === 'success') {
          localStorage.setItem('team', response.data.teamId);
          dispatch({ type: 'REGISTER', payload: response.data.teamId });
          history.push('/teamaccount');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <main>
      <FormsStyled className="login-signup-container">
        {/* login section */}
        <section id="login">
          <h2>
            <span>Have account?</span> Log In!
          </h2>

          <form id="logInForm" className="form" onSubmit={loginTeam}>
            <div>
              <label htmlFor="loginEmail">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                ref={inputRef}
              />
            </div>

            <div>
              <label htmlFor="loginPassword">Password</label>
              <input
                type="password"
                value={loginPasword}
                onChange={(e) => setLoginPasword(e.target.value)}
                required
              />
            </div>

            <div>
              <input type="submit" value="Log In" />
            </div>
          </form>
          <p className="loginMessage">{loginErrorMessage}</p>
        </section>
        {/* sign up section */}
        <section id="signup">
          <h2>
            <span>New user?</span> Sign Up!
          </h2>

          <form id="signUpForm" onSubmit={signupTeam}>
            <div>
              <label htmlFor="signUpImage">Team image</label>
              <input
                type="url"
                required
                value={signupTeamImage}
                onChange={(e) => setSignupTeamImage(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="signUpTitle">Team title</label>
              <input
                type="text"
                required
                value={signupTeamTitle}
                onChange={(e) => setSignupTeamTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="signUpEmail">Email</label>
              <input
                type="text"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                ref={signupEmailInputRef}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="signUpPassword">
                Password
              </label>
              <input
                type="password"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                ref={signupPasswordInputRef}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="signUpConfirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <input type="submit" value="Sign Up" />
            </div>
          </form>
          <p className="signUpMessage">{signupErrorMessage}</p>
        </section>
      </FormsStyled>
    </main>
  );
};

export default LoginPage;
