const {
  questionsForArtists,
  songsForCombos,
} = require('./constants');

/********************Helper Functions**************************************/

//gets the question from the questions list of the artist and returns the question.
const getQuestion = (counter, artist_name) => {
  
  const artist = artist_name.split(' ').join('');
  const list = questionsForArtists[artist];
  if(list === undefined) {
    return null;
  }
  else {
  const question = list[counter];
  //console.log(question);
  return question;
  }
};

//Function used to map the user inputs to find the "song match". Returns the song matched
const giveResult = (answerList) => {
  
  //console.log("Inside function for getting result");
  //gets the recent answers from the answer list and maps to find the song match
  let finalResult = getProperty(answerList, songsForCombos);
  console.log(finalResult);
  return finalResult;
  
};

//function used to generate a random number from 0 to max
const randomGenerator = (max) => {
  const randomNum = Math.floor(Math.random() * max);
  return randomNum;
};

//function to the check all the answers in the answerList are valid. If valid, it returns the mapped value in the dictionary.
//Else, returns null
const getProperty = (answerList, songsForCombos) => {
  return answerList.reduce((prop, nestedProp) => {
    return(prop && prop[nestedProp]) ? prop[nestedProp] : null;
  }, songsForCombos);
};
module.exports = {
  getQuestion,
  giveResult,
  randomGenerator
};