import Team from '../models/teamModel.js';
import Vote from '../models/voteModel.js';

const getTeams = async (req, res) => {
  const teams = await Team.find({});
  const votes = await Vote.find({});

  let teamsAndVotes = teams.reduce((total, team) => {
    let teamsVotes = votes.find((vote) => vote.team_id === '' + team._id);

    total.push({ ...team.toObject(), votes: teamsVotes.votes });

    return total;
  }, []);

  res.json(teamsAndVotes);
};

export default getTeams;
