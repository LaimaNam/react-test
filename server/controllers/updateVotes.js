import Vote from '../models/voteModel.js';

const updateVotes = async (req, res) => {
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
};

export default updateVotes;
