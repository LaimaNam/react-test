import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { TeamContext } from './../App';

//styles
const TeamMain = styled.div`
  text-align: center;
  max-width: 1024px;
  margin: auto;
  .teamMainInfo {
    padding: 20px 0;
  }

  .teamMainInfo button {
    padding: 10px 15px;
    margin-top: 20px;
    border: none;
    background-color: #98c1d9;
    color: #fff;
    transition: 0.3s;
  }
  .teamMainInfo button:hover {
    background-color: #3d5a80;
    cursor: pointer;
  }

  h4 {
    margin: 20px;
  }

  p {
    width: 70%;
    margin: auto;
  }
`;

const Teams = styled.section`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  div {
    width: 100%;
    text-align: center;
    box-shadow: 0px 0px 10px -3px #000000;
    margin-bottom: 20px;
  }

  h4 {
    margin: 0;
    margin-top: 5px;
  }

  p {
    margin-bottom: 15px;
  }

  div img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  div button {
    width: 50%;
    border: none;
    padding: 10px;
    cursor: pointer;
    transition: 0.3s;
  }

  .remove:hover {
    background-color: tomato;
    color: #fff;
  }

  .add {
    background-color: #98c1d9;
    color: #fff;
  }
  .add:hover {
    background-color: #3d5a80;
    cursor: pointer;
  }

  @media (min-width: 508px) {
    div {
      width: calc(100% / 2 - 10px);
      text-align: center;
      box-shadow: 0px 0px 10px -3px #000000;
      margin-bottom: 20px;
    }
  }

  @media (min-width: 768px) {
    div {
      width: calc(100% / 3 - 10px);
      text-align: center;
      box-shadow: 0px 0px 10px -3px #000000;
      margin-bottom: 20px;
    }
  }

  @media (min-width: 1000px) {
    div {
      width: calc(100% / 4 - 10px);
      text-align: center;
      box-shadow: 0px 0px 10px -3px #000000;
      margin-bottom: 20px;
    }
  }
`;

// -- API URL
const GET_TEAMS_URI = 'http://localhost:5000/api/teams';
const GET_VOTES_URI = 'http://localhost:5000/api/votes/';

const getTeams = async (id, setTeamsToShow, setCurrentTeam) => {
  try {
    const teams = await axios.get(GET_TEAMS_URI);
    setTeamsToShow(teams.data);
    let currentTeamData = teams.data.find((team) => team._id === id);
    setCurrentTeam(currentTeamData);
  } catch (err) {
    return console.log(err);
  }
};

const getVotes = async (setVotes) => {
  try {
    const votes = await axios.get(GET_VOTES_URI);
    setVotes(votes.data);
  } catch (err) {
    return console.log(err);
  }
};

const updateVotes = (teamToVoteId, vote) => {
  return axios.put(GET_VOTES_URI + teamToVoteId, vote);
};

const TeamAccountPage = () => {
  // -- HOOKS
  // -- -- global state
  const { state, dispatch } = useContext(TeamContext);

  // -- -- local state
  const [currentTeam, setCurrentTeam] = useState({});
  const [teamsToShow, setTeamsToShow] = useState([]);
  const [votes, setVotes] = useState([]);

  // -- redirects
  const history = useHistory();

  // side effects
  useEffect(() => {
    getTeams(state.team, setTeamsToShow, setCurrentTeam);
    getVotes(setVotes);
  }, [state.team]);

  //custom functions
  const logoutTeam = () => {
    dispatch({ type: 'LOGOUT', team: '' });
    localStorage.removeItem('team');
    history.push('/login');
  };

  //add vote
  const upVote = (e) => {
    const votingFor = e.target.id;

    const teamToVote = votes.find(
      (teamToVote) => teamToVote.team_id === votingFor
    );

    let voteDataToUpdate = {
      votes: teamToVote.votes + 1,
      voted_by: state.team,
    };

    //validating if logged in team already voted or not
    if (teamToVote.voted_by.indexOf(state.team) === -1) {
      console.log('UPVOTE -> validation ran');

      updateVotes(votingFor, voteDataToUpdate);
      getTeams(state.team, setTeamsToShow, setCurrentTeam);
      getVotes(setVotes);
    }
  };

  const downVote = (e) => {
    const downVotingFor = e.target.id;

    const teamToDownVote = votes.find(
      (teamToVote) => teamToVote.team_id === downVotingFor
    );

    let voteDataToUpdate = {
      votes: teamToDownVote.votes - 1,
      voted_by: state.team,
    };

    //validating if logged in team already voted or not

    if (
      teamToDownVote.voted_by.indexOf(state.team) === -1 &&
      teamToDownVote.votes > 0
    ) {
      console.log('DOWNVOTE -> validation ran');

      updateVotes(downVotingFor, voteDataToUpdate);
      getTeams(state.team, setTeamsToShow, setCurrentTeam);
      getVotes(setVotes);
    }
  };

  return (
    <main>
      {teamsToShow && currentTeam ? (
        <TeamMain>
          <div className="teamMainInfo" image={currentTeam.image}>
            <h2>{currentTeam.title} team account page</h2>
            <h4>Rules</h4>
            <p>
              You can only vote one time on each team. 1 score up(+) or 1 score
              down(-). Once voted - there is no turning back. So think twice
              before giving your vote. If team has 0 score you can not vote
              down.
            </p>
            <button onClick={() => logoutTeam()}>Logout</button>
          </div>
          <Teams>
            {teamsToShow.map((team) => (
              <div key={team._id}>
                <img src={team.image} alt="" />
                <h4>
                  {currentTeam._id === team._id
                    ? `${team.title} team (Your team)`
                    : `${team.title} team`}
                </h4>
                <p>Score: {team.votes}</p>

                <button className="remove" id={team._id} onClick={downVote}>
                  &#x268A;
                </button>
                <button className="add" id={team._id} onClick={upVote}>
                  &#x271A;
                </button>
              </div>
            ))}
          </Teams>
        </TeamMain>
      ) : (
        <p>Something went wrong</p>
      )}
    </main>
  );
};

export default TeamAccountPage;
