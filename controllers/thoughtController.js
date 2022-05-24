const { Thought, User } = require('../models');

// Aggregate function to get the number of students overall
const thoughtCount = async () =>
  Thought.aggregate()
    .count('thoughtCount')
    .then((numberOfThoughts) => numberOfThoughts);

module.exports = {

  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then(async (thoughts) => {

        const thoughtObj = {
          thoughts,
        };
        const reactionObj = await Thought.find( { _id: thoughtObj.reactions } );
        const thought = {
          ...thoughtObj,
          ...reactionObj
        }
        return res.json(thought);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
    //   .select()
      .then(async (thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // create a new thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        User.findOneAndUpdate(
          { username: req.body.username },
          { $push: { thoughts: thought._id } },
          { new: true }
        )
          .then((user) => {
          !user
            ? res.status(404).json({ message: 'No user with that ID exists' })
            : res.json(user)
          })
          .catch((err) => res.status(500).json(err));
        })
      .catch((err) => res.status(500).json(err));
  },

  // Delete a thought and remove it from the user
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID exists' })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'Thought deleted, but no user found',
            })
          : res.json({ message: 'Thought successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove reaction from a thought
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: req.params.reactionId } },
      { runValidators: true, new: true },
      console.log(req.params.reactionId)

    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID' })
          : res.json( {message: 'succesfully removed reaction', thought} )
      )
      .catch((err) => res.status(500).json(err));
  },
};
