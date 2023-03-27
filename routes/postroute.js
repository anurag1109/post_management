const express = require("express");
const postrouter = express.Router();
postrouter.use(express.json());
const jwt = require("jsonwebtoken");
const { authentication } = require("../middleware/authentication");
const { postmodel } = require("../models/model");

postrouter.get("/", authentication, async (req, res) => {
  let query = req.query;
  const { page, max, min } = req.query;
  const token = req.headers.authorization;
  jwt.verify(token, "key", async (err, decoded) => {
    if (decoded) {
      if (Object.keys(query).length == 0) {
        posts = await postmodel.find({ user: decoded.userId });
      } else {
        posts = await postmodel
          .find({
            user: decoded.userId,
            $or: [
              { device: query.device },
              { device: query.device1 },
              { device: query.device2 },
            ],
            $and: [
              { no_of_comments: { $gt: min ? min : 0 } },
              { no_of_comments: { $lt: max ? max : Infinity } },
            ],
          })
          .skip(page ? (page - 1) * 3 : 0)
          .limit(3);
      }
      res.status(200).send(posts);
    } else {
      res.status(200).send({ msg: "you can see your posts only" });
    }
  });
});

postrouter.post("/add", authentication, async (req, res) => {
  try {
    let data = req.body;
    const post = new postmodel(data);
    post.save();
    res.status(200).send({ msg: "post has been added" });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

postrouter.get("/top", authentication, async (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, "key", async (err, decoded) => {
    if (decoded) {
      let maxcomment = await postmodel
        .find({ user: decoded.userId })
        .sort({ no_of_comments: -1 })
        .limit(1);
      res.status(200).send(maxcomment);
    } else {
      res.status(200).send({ msg: "you can see your posts only" });
    }
  });
});

postrouter.patch("/update/:id", authentication, async (req, res) => {
  const noteid = req.params.id;
  const token = req.headers.authorization;
  jwt.verify(token, "key", async (err, decoded) => {
    let post = await postmodel.find({ user: decoded.userId, _id: noteid });
    if (post.length > 0) {
      await postmodel.findByIdAndUpdate({ _id: noteid }, req.body);
      res.status(200).send({ msg: "note has been updated" });
    } else {
      res.status(200).send({ msg: "no post exist" });
    }
  });
});

postrouter.delete("/delete/:id", authentication, async (req, res) => {
  const noteid = req.params.id;
  const token = req.headers.authorization;
  jwt.verify(token, "key", async (err, decoded) => {
    let post = await postmodel.find({ user: decoded.userId, _id: noteid });
    if (post.length > 0) {
      await postmodel.findByIdAndDelete({ _id: noteid });
      res.status(200).send({ msg: "note has been deleted" });
    } else {
      res.status(200).send({ msg: "no post exist" });
    }
  });
});
module.exports = { postrouter };
