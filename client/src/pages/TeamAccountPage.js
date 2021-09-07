import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { TeamContext } from './../App';

//styles
const Teams = styled.section`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  div {
    width: calc(100% / 4 - 10px);
    padding: 10px;
    text-align: center;
  }

  div h4,
  p {
    margin: 0;
  }
  div img {
    width: 100%;
    height: 200px;
    object-fit: cover;
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
        <>
          <h2>{currentTeam.title} account page</h2>
          <div>
            <p>{state.team}</p>
            <button onClick={() => logoutTeam()}>Logout</button>
          </div>
          <Teams>
            {teamsToShow.map((team) => (
              <div key={team._id}>
                <img src={team.image} alt="" />
                <h4>
                  {currentTeam._id === team._id
                    ? `${team.title}(Your team)`
                    : team.title}
                </h4>
                <p>Score: {team.votes}</p>

                <button id={team._id} onClick={upVote}>
                  +
                </button>
                <button id={team._id} onClick={downVote}>
                  -
                </button>
              </div>
            ))}
          </Teams>
        </>
      ) : (
        <p>Something went wrong</p>
      )}
    </main>
  );
};

export default TeamAccountPage;
