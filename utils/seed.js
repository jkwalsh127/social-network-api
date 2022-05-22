const connection = require('../config/connection');
const { User, Thought } = require('../models');
const reactionSchema = require('../models/Reaction');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Drop existing users
  await User.deleteMany({});

  // Drop existing thoughts
  await Thought.deleteMany({});

// const getRandomReactions = (int) => {
//     const results = [];
//     for (let i = 0; i < int; i++) {
//       results.push({
//         reactionBody: getRandomArrItem(reaction),
//       });
//     }
//     return results;
// };

  // Create array to hold thoughts
  const thought = [
    'Beets taste good',
    'Carrots taste good',
    'Dill taste good',
    'Eggplant taste good',
    'Fennel taste good',
    'Garlic taste good',
    'Honeydew melons taste good',
    'Iceberg lettuce taste good',
    'Jalapenos taste good',
];

const thoughts = [];

  const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const getRandomThought = () =>
    `${getRandomArrItem(thought)}`;

  // // Get random reaction objects
  // const reactionsList = getRandomReactions(5);

  // Loop 10 times -- add thoughts to the thoughts array
  for (let i = 0; i < 10; i++) {
    const thoughtText = getRandomThought(5);

    thoughts.push({
      thoughtText,
    });
  }

  await Thought.collection.insertMany(thoughts);

  await User.collection.insertOne({
    username: 'jkwalsh',
    email: 'jkwalsh127@gmail.com',
    thought: [
      {
        thoughtText: 'Apples taste good',
        createdAt: "2022-05-21T14:29:01.073Z",
        reactions: {
          reactionId: '628a72b29b7e8703b41a24af',
          createdAt: "2022-05-21T14:50:40.211Z",
          _id: "62886b209e6d1b87a826de06",
          reactionBody: 'Nice!',
          username: 'otherUser',
        },
      }
    ]
  });

  console.table(thoughts);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
