const express = require("express");
const router = express.Router();
const encrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../model/user");
const bcrypt = require("bcryptjs/dist/bcrypt");
const config = require("config");
const user = require("../model/user");

// create user
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "email is required").not().isEmpty().isLength({ min: 6 }),
  ],
  async (req, res) => {
    // console.log();
    const error = validationResult(req);
    console.log(req.body);
    if (!error.isEmpty()) {
      //check body validate
      return res.status(400).json({ errors: error.array() });

      // return res.json({status : '200',message : 'ok'})
    }

    try {
      const { name, email, password, avatar } = req.body;
      //find one : giong sql cau lenh select where attibute = value
      const user = await User.findOne({ email });
      //   console.log("user_find:", user);
      if (user) {
        res.status(400).json({
          status: 400,
          message: "email has exist",
        });
      } else {
        //add user to db
        const user = new User({
          name,
          email,
          password,
        });

        //ma hoa password

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        //create json web token
        await user.save();
        const payload = {
          user: {
            id: user.id,
          },
        };
        const jwt = jsonwebtoken.sign(payload, config.get("jwtToken"), {
          expiresIn: 100000,
        });

        console.log("user", user);
        res.json({
          status: 200,
          message: "Sucess",
          user: user,
          token: jwt,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

//@route    POST api/users
//@desc     Register user
//@access   Public

// router.post('/',(req,res)=>{
//     res.send(req.body);
// });

//create user
router.post(
  "/login",
  [
    check("email", "email is not required").not().isEmpty().isEmail(),
    check("password", "password is not required").not().isEmpty(),
  ],
  async (req, res) => {
    const validate = validationResult(req);
    if (!validate.isEmpty()) {
      res.status(400).json({ error: validate });
    } else {
      try {
        // res.json(req.body);
        const { email, password } = req.body;
        const user_find = await User.findOne({ email });
        if (user_find) {
          //check login as suceess or fail
          const isMatch = await bcrypt.compare(password, user_find.password);
          if (isMatch) {
            const payload = {
              user: {
                id: user_find.id,
              },
            };
            const token = jsonwebtoken.sign(payload, config.get("jwtToken"), {
              expiresIn: 10000,
            });
            res.json({ token: token });
          } else {
            res.json({ error: user_find, status: "error" });
          }
          // res.json(user_find);
        } else {
          res.json({
            status: "200",
            type: "error",
            message: "khong tim thay user !",
          });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json("error");
      }
    }
  }
);

router.get("/", async (req, res) => {
  const ListUser = await user.find();
  res.json(ListUser);
});

module.exports = router;
