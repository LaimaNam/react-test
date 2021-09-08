import Team from '../models/teamModel.js';

const logIn = (req, res) => {
  let team = req.body;

  Team.find().then((result) => {
    let teamFounded = result.find(
      (teamFromDB) =>
        teamFromDB.email === team.email && teamFromDB.password === team.password
    );

    if (teamFounded) {
      let { _id } = teamFounded;

      res.json({
        loginStatus: 'success',
        teamId: _id,
      });
    } else {
      res.status(401).json({
        loginStatus: 'failed',
        message: 'Given email or password is incorrect',
      });
    }
  });
};

export default logIn;
