const express = require("express");
const router = express.Router();
const Credentials = require("../models/usermodels");
const Posts = require("../models/posts-model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "fdnbgkd656d5g6dfgmnbdfjfg";
const userAuthentication = require("../middlewares/jwt-authentication");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const existing = await Credentials.findOne({ email: email });

    if (existing !== null) {
      res.status(200).json({
        status: "failed",
        message: "user already exists, please enter new email id",
      });
    } else {
      const saveData = await Credentials.create({
        name: name,
        email: email,
        password: hashPassword,
      });
      res.status(201).json({
        status: "success",
        message: "user registered successfully",
      });
    }
  } catch (error) {
    res.json({
      status: "failed",
      message: "kindly fill all the fields",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Credentials.findOne({ email: email });
    console.log(user);
    if (!user) {
      res.status(404).json({
        status: "failed",
        message: "Email does not exist kindly register first",
      });
    } else {
      const isPasswordMatching = await bcrypt.compare(password, user.password);
      console.log(isPasswordMatching);
      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
        expiresIn: "5d",
      });
      if (isPasswordMatching) {
        res.status(200).json({
          status: "success",
          message: "user authentication successful, you are logged in successfully",
          jwt_token: token,
        });
      } else {
        res.status(404).json({
          status: "failed",
          message: "user authentication failed, email or password is incorrect",
        });
      }
    }
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: "kindly fill all the fields",
    });
  }
});
//using middleware for authentication
router.use("/posts", userAuthentication);
router.use("/posts:postId", userAuthentication);

router.get("/posts", async (req, res) => {
  try {
    const data = await Posts.find();
    res.status(200).json({
      posts: data,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: "Failed to render posts",
    });
  }
});
router.post("/posts", async (req, res) => {
  try {
    const { title, body, image } = req.body;
    const savePost = await Posts.create({
      name: req.user.name,
      title: title,
      body: body,
      image: image,
      user: req.user.email,
    });
    res.status(201).json({
      status: "successful",
      post: savePost,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
});

router.put("/posts/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      return res.status(404).json({
        status: "Failed",
        message: "Id not found",
      });
    }
    const updatePost = await Posts.findByIdAndUpdate(
      { _id: postId },
      req.body,
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Post updated successfully",
      post: updatePost,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: error,
    });
  }
});
router.delete("/posts/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      return res.status(404).json({
        status: "Failed",
        message: "Id not found",
      });
    }
    const deletePost = await Posts.findByIdAndDelete(postId);
    res.status(200).json({
      status: "Success",
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Id not found",
    });
  }
});

module.exports = router;
