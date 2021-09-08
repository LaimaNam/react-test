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

  .teamMainInfo .loggedInTeam {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .teamMainInfo .loggedInTeam h2 {
  }

  .teamMainInfo button {
    padding: 7px 10px;

    border: none;
    background-color: #e07a5f;
    /* background-color: #f2cc8f; */
    letter-spacing: 1px;
    color: #fff;
    transition: 0.3s;
  }
  .teamMainInfo button:hover {
    background-color: #3d5a80;
    background-color: #98c1d9;
    cursor: pointer;
  }

  .teamMainInfo .battleRules {
    position: relative;
    display: flex;
    width: 80%;
    margin: auto;
  }

  .teamMainInfo .battleRules h4 {
    writing-mode: vertical-rl;
    text-orientation: sideways-right;
    background-color: #98c1d9;
    padding: 0px 20px;
    color: #fff;
    letter-spacing: 1px;
  }

  .teamMainInfo .battleRules p {
    padding: 20px;
    border: 2px solid #98c1d9;
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
    position: relative;
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

  .isVoted {
    position: absolute;
    margin: 0;
    padding: 10px 5px;
    background-color: #e07a5f;
    color: #fff;
    writing-mode: vertical-rl;
    text-orientation: sideways-right;
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

// const GET_TEAMS_URI = 'https://ca-react-test.herokuapp.com/api/teams';
// const GET_VOTES_URI = 'https://ca-react-test.herokuapp.com/api/votes/';

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

  // -- side effects
  useEffect(() => {
    getTeams(state.team, setTeamsToShow, setCurrentTeam);
    getVotes(setVotes);
  }, [state.team]);

  // CUSTOM FUNCTIONS
  const logoutTeam = () => {
    dispatch({ type: 'LOGOUT', team: '' });
    localStorage.removeItem('team');
    history.push('/login');
  };

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

  //finding out on what team current logged in team already voted and rendering a badge "already voted"
  const votedFor = (teamId, currentTeamId) => {
    const teamToVote = votes.find((vote) => vote.team_id === teamId);

    if (teamToVote && teamToVote.voted_by) {
      if (teamToVote.voted_by.some((id) => id === currentTeamId)) {
        return true;
      }
    }
  };

  //  --------------- Rendering
  return (
    <main>
      {teamsToShow && currentTeam ? (
        <TeamMain>
          <div className="teamMainInfo" image={currentTeam.image}>
            <div className="loggedInTeam">
              <h2>{currentTeam.title} team</h2>
              <button onClick={() => logoutTeam()}>Logout</button>
            </div>

            <div className="battleRules">
              <h4>Rules</h4>
              <p>
                You can only vote one time on each team. 1 score up(+) or 1
                score down(-). Once voted - there is no turning back. If team
                has 0 score you can not vote down. Think twice before giving
                your vote.
              </p>
            </div>
          </div>
          <Teams>
            {teamsToShow.map((team) => (
              <div key={team._id}>
                {votedFor(team._id, state.team) && (
                  <p className="isVoted">Already voted</p>
                )}
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
