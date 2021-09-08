import Team from '../models/teamModel.js';
import Vote from '../models/voteModel.js';

const signUp = async (req, res) => {
  const team = req.body;

  Team.find()
    .then((result) => {
      const teamExists = result.some(
        (temaFromDB) => temaFromDB.email === team.email
      );

      if (teamExists) {
        res.json({
          registrationStatus: 'failed',
          message: 'TEan with given email already exists',
        });
      } else {
        const newTeam = new Team(team);
        const teamVotes = new Vote({ team_id: newTeam._id });
        teamVotes.save();

        newTeam.save().then((result) => {
          let { _id } = result;
          res.json({
            registrationStatus: 'success',
            teamId: _id,
          });
        });
      }
    })
    .catch((err) => console.log(err));
};

export default signUp;
