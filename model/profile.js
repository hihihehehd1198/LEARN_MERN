const mongoose = require("mongoose");

const userProfile = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    // left join tu query bang users (giong 1 dang cua khoa ngoai )
  },
  company: {
    type: String,
  },
  skills: {
    type: [String],
    required: true,
  },
  location: {
    type: String,

  },
  //kinh nghiem lam viec
  experience: [
    {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
        required: true,
      },
    },
  ],
});
module.exports = Profile = mongoose.model("profile", userProfile);
