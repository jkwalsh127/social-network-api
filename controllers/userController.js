const { User, Thought } = require('../models');

const friendCount = async (userId) =>
  User.aggregate([
    {
      $group: {
        _id: userId,
        friendCount: { $sum: '$friends' }
      }
    }
  ]);

module.exports = {

  // Get all users
  getUsers(req, res) {
    User.find()
      // .then((users) => res.json(users))
      // .catch((err) => res.status(500).json(err));
      .then(async (users) => {
        const userObj = {
          users,
          friendCount: await friendCount(req.params.userId),
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Get a user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
    //   .select()
      .then((user) => 
        !user 
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
      // .then(async (user) => {
      //   const userObj = {
      //     user,
      //     friendCount: await friendCount(),
      //   };
      //   return res.json(userObj);
      // })
      // .catch((err) => {
      //   console.log(err);
      //   return res.status(500).json(err);
      // });
  },

  // Create a user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and Thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  //Add new friend to User
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friend: req.body } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user found with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  //Delete friend from User
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friend: { friendId: req.params.friendId } } },
      { runValidators: true, new: true },
    )
      .then((user) =>
        !user
          ? res
            .status(404)
            .json({ message: 'No user found with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};