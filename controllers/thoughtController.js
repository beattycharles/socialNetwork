const { response } = require("express");
const { thought, user } = require("../models");
const { populate } = require("../models/thought");

module.exports = {
  //GET to get all thoughts
  getThoughts(req, res) {
    thought
      .find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  //GET to get a single thought by its _id
  getSingleThought(req, res) {
    thought
      .findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought found with this id." })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  //POST to create a new thought
  createThought(req, res) {
    thought
      .create(req.body)
      .then((thought) => {
        return user.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Thought made, but no user found with this id.",
            })
          : res.json("User found and thought posted.")
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  //PUT to update thought
  updateThought(req, res) {
    thought
      .findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this id." })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  //DELETE to remove a thought
  deleteThought(req, res) {
    thought
      .findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this id." })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  //POST to create a reaction stored for single thought's reaction
  addReaction(req, res) {
    console.log(req);
    thought
      .findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that id." })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  //DELETE
  deleteReaction(req, res) {
    console.log(req);
    thought
      .findOneAndUpdate(
        { _id: req.params._id },
        { $pull: { reactions: req.params.reactionId } },
        { new: true }
      )
      // .select("-__v")
      // .populate("reactions")
      .then((thought) => {
        console.log(thought);
        if (!thought)
          res.status(404).json({ message: "No thought with that id." });
        res.json({ message: "Reaction deleted!" });
      })
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).json(err));
  },
};
