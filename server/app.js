import express, { response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

//controllers
import getVotes from './controllers/getVotes.js';
import getTeams from './controllers/getTeams.js';
import signUp from './controllers/signUp.js';
import logIn from './controllers/logIn.js';
import updateVotes from './controllers/updateVotes.js';

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

// -- -- ROUTES
//GET
app.get('/', (req, res) => res.send('API is running...'));
app.get('/api/teams', getTeams);
app.get('/api/votes', getVotes);

//POST
app.post('/api/teams/signup', signUp);
app.post('/api/teams/login', logIn);

//PUT
app.put('/api/votes/:id', updateVotes);
