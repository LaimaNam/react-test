import express, { response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Team from './models/teamModel.js';
import Vote from './models/voteModel.js';

//controllers
import getVotes from './controllers/getVotes.js';
import getTeams from './controllers/getTeams.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Connecting DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log(`Connected to MongoDB`);
    // Starting server
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
  });

// ROUTES

//GET
app.get('/', (req, res) => res.send('API is running...'));

app.get('/api/teams', getTeams);

app.get('/api/votes', getVotes);

//POST
// signup - register new Team
app.post('/api/teams/signup', async (req, res) => {
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
});
// login
app.post('/api/teams/login', (req, res) => {
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
});

//PUT
app.put('/api/votes/:id', async (req, res) => {
  try {
    let teamVotesToUpdateId = req.params.id;
    let newVote = req.body;
    await Vote.findOneAndUpdate(
      { team_id: teamVotesToUpdateId },
      { votes: newVote.votes, $push: { voted_by: newVote.voted_by } }
    );

    res.json({ message: 'Voted!' });
  } catch (err) {
    res.json({ message: 'Something went wrong' });
  }
});
