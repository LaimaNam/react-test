import mongoose from 'mongoose';
const { Schema } = mongoose;

const teamSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Team = mongoose.model('team', teamSchema);
export default Team;
