const thoughts = [
    'Apples taste good',
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

const reaction = [
    'Nice!',
    'Cool!',
    'Well said!',
    'Agreed!',
    'Questionable...',
    'One way of looking at it...',
    'Maybe reconsider this thought...',
    'Tell us more!',
    'Was thinking the same thing',
    'Run for president!'
];

const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomThought = () =>
  `${getRandomArrItem(thoughts)}`;

const getRandomReactions = (int) => {
    const results = [];
    for (let i = 0; i < int; i++) {
      results.push({
        reactionBody: getRandomArrItem(reaction),
      });
    }
    return results;
};
  
module.exports = { getRandomThought, getRandomReactions };