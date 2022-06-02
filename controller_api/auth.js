const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const User = require("../model/user");

router.get("/", auth, async (req, res) => {
  console.log(req.user.id);
  const id = req.user.id;
  //   res.status(200).json({ id: id });

  //check account with token
  try {
    const user = await User.findById(id);
    res.json({ user: user });
  } catch (error) {}
});

module.exports = router;
