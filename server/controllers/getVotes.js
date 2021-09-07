import Vote from '../models/voteModel.js';

const getVotes = async (req, res) => {
  const votes = await Vote.find({});
  res.json(votes);
};

export default getVotes;
