const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const profile = require("../model/profile");
const { check, validationResult } = require("express-validator");
const user = require("../model/user");

//get profile by id
router.get("/", auth, async (req, res) => {
  try {
    //find user with id

    const user_find = await User.findById(req.user.id);
    if (user_find) {
      res.json({ status: 200, message: "ok", user: req.user });
    } else {
      res.json({ status: 400, message: "khong tim thay user !" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

//create and update profile
router.post(
  "/createAndUpdate",
  [
    auth,
    check("skills", "skills is not required").not().isEmpty(),
    check("location", "location is not required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const validate = await validationResult(req);
      if (!validate.isEmpty()) {
        res.status(400).send(validate);
      } else {
        const { company, skills, location } = req.body;
        const profileEditOrCreate = {};
        profileEditOrCreate.user = req.user.id;
        if (company) profileEditOrCreate.company = company;
        if (skills)
          profileEditOrCreate.skills = skills
            .toString()
            .split(",")
            .map((x) => x.trim());
        if (location) profileEditOrCreate.location = location;

        let profile_find = await profile.findOne({ user: req.user.id });

        if (profile_find) {
          profile_find = await profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileEditOrCreate },
            { new: true }
          );
          console.log(profile_find);
          return res.json(profile_find);
        } else {
          const profile_new = new profile(profileEditOrCreate);
          await profile_new.save();
          res.json(profileEditOrCreate);
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
);

//delete user and profile

//get All profiles and with user id

router.get("/findall", async (req, res) => {
  try {
    const profiles = await profile.find().populate("user", ["name"]);
    res.json(profiles);
  } catch (error) {
    console.log(error);
    res.status(500).send("find all profile error ");
  }
});

//find profile with user id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const profile_find = await profile.findOne({ user: id }).populate("user");
    if (profile_find) {
      res.status(200).send(profile_find);
    } else {
      console.log(id);
      res.status(400).send("cannot find profile");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("fail");
  }
});
module.exports = router;

//delete profile user id
router.delete("/", auth, async (req, res) => {
  try {
    await profile.findOneAndDelete({ user: req.user.id });
    await user.findOneAndDelete({ _id: req.user.id });
    res.json({ user: req.user });
  } catch (err) {
    res.json({ error: err });
  }
});

//add profile detail
router.put(
  "/experience",
  auth,
  [
    check("title", "this is required").not().isEmpty(),
    check("company", "company is required").not().isEmpty(),
    check("from", "from date is required").not().isEmpty(),
  ],
  async (req, res) => {
    // console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    } else {
      const { title, company, from, to } = req.body;
      const newExp = {
        title: title,
        company: company,
        from: from,
        to: to,
      };
      try {
        console.log(req.user);
        const profile1 = await profile.findOne({ user: req.user.id });
        console.log(profile1);
        if (profile1.experience) {
          profile1.experience.unshift(newExp);
        } else {
          profile1.experience = [newExp];
        }
        await profile1.save();
        res.json({ sucess: profile1 });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  }
);
//delete all profile detail
router.post("/deleteProfileDetail", auth, async (req, res) => {
  try {
    const profile2 = await profile.findOne({ user: req.user.id });
    profile2.experience = [];
    await profile2.save();
    res.json(profile2);
  } catch (err) {
    res.json({ error: err.message });
  }
});

//delete profile detail with id (exp)
router.delete("/exp/:exp_id", auth, async (req, res) => {
  console.log(req.user);
  try {
    const profile3 = await profile.findOne({ user: req.user.id });
    console.log(profile3);
    const removeIndex = profile3.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile3.experience.splice(removeIndex, 1);
    await profile3.save();
    res.json({ msg: "ok" });
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
});
