const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { getRandomThought, getRandomReactions } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Drop existing users
  await User.deleteMany({});

  // Drop existing thoughts
  await Thought.deleteMany({});

  // Create empty array to hold the thoughts
  const thoughts = [];

  // Get random reaction objects
  const reactions = getRandomReactions(5);

  // Loop 10 times -- add thoughts to the thoughts array
  for (let i = 0; i < 10; i++) {
    const thoughtText = getRandomThought();

    thoughts.push({
      thoughtText,
    });
  }

  await Thought.collection.insertMany(thoughts);

  await User.collection.insertOne({
    username: 'jkwalsh',
    email: 'jkwalsh127@gmail.com',
    thoughts: [...thoughts],
  });

  console.table(thoughts);
  console.table(reactions);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
