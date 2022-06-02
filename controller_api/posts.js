const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../middleware/auth");
const Post = require("../model/post");
const User = require("../model/user");
const Profile = require("../model/profile");

router.get("/", (req, res) => {
  res.send("post route");
});

//add post
router.post(
  "/",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.json({ error: error.array() });
    } else {
      try {
        const user = await User.findById(req.user.id).select("-password");
        const newPost = new Post({
          text: req.body.text,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id,
        });
        const post = await newPost.save();
        res.json({ msg: post });
      } catch (error) {
        res.json({ error: error.message });
      }
    }
  }
);

//get & delete post

//get all posts
router.get("/getAll", auth, async (req, res) => {
  try {
    const listMessage = await Post.find().sort({ date: -1 });
    res.json({ listComment: listMessage });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// get posts with user id
router.get("/getAll/:user_id", auth, async (req, res) => {
  try {
    const listComment = await Post.findById(req.params.user_id);
    if (listComment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "post not found " });
    } else {
      res.json({ msg: listComment });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});
//delete post with id
router.delete("/delete/:post_id", auth, async (req, res) => {
  try {
    const comment = await Post.findByIdAndDelete(req.params.post_id);
    if (!comment) {
      res.json({ error: "khong tim thay post " });
    } else {
      res.json({ msg: "delete done " });
    }
  } catch (err) {
    res.json({ err: err.message });
  }
});

//post like and unlike
router.put("/updateLike/:id", auth, async (req, res) => {
  try {
    const postFind = await Post.findById(req.params.id);
    if (
      postFind.likes.filter((like) => like.user.toString() === req.user.id)
        .length > 0
    )
      res.json({ msg: "user has been liked " });
    else {
      postFind.likes.unshift({ user: req.user.id });
      await postFind.save();
      res.json({ msg: "save data !" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

//unlike post
router.delete("/updateLike/:id", auth, async (req, res) => {
  try {
    const postFind = await Post.findById(req.params.id);
    const removeIndex = postFind.likes
      .map((x) => x.user.toString())
      .indexOf(req.user.id);
    postFind.likes.splice(removeIndex, 1);
    await postFind.save();
    res.json({ msg: "sucess !", object: postFind, user: req.user.id });
  } catch (error) {
    res.json({ error: error.message });
  }
});

//add & remove comments
router.post("/updateComment/:id", auth, async (req, res) => {
  try {
    if (req.body && req.body["comment"]) {
      const postFind = await Post.findById(req.params.id);
      const comment = {
        user: req.user.id,
        text: req.body.comment,
      };
      if (postFind.comments.length === 0) {
        postFind.comments.push(comment);
      } else {
        const listComment = postFind.comments
          .filter((x) => x.user)
          .indexOf(req.user.id);
        postFind.comments[listComment] = comment;
      }
      await postFind.save();
      res.json({ msg: "sucess" });
    } else {
      res.json({ error: "no comment " });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

//remove comments
router.delete("/deleteComment/:id", auth, async (req, res) => {
  try {
    const listComment = await Post.findById(req.params.id);
    if (listComment.comments.length > 0) {
      const find = listComment.comments.map((x) => x.user).indexOf(req.user.id);
      if (find) {
        listComment.comments.splice(find, 1);
        await listComment.save();
        res.json({ msg: "sucess delete comment " });
      } else {
        res.json({ error: "comment as not found" });
      }
    } else {
      res.json({ error: "post has no comment " });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});
module.exports = router;
