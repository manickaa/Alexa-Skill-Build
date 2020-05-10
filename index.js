const Alexa = require('ask-sdk-core');

/*******variable declarations*************************************/
let counter = 0;
let artist_name = "";
let answerList = [];

//example questions
const questionsForArtists = {
  Arianagrande: ["How are you feeling right now? Sad, Anxious  or  Happy?", "What is your best quality? Wisdom, Manipulation or Empathy? ", "Which emoji do you prefer? Black Heart or White Clouds?"],
  Brunomars: ["Choose a place for vacation: Tokyo, Los Angeles  or  Melbourne ", "How are you feeling right now? Happy, sad  or  Depressed", "Its friday night!!! You're gonna stay home or hang out with friends?"],
  BillieEilish: ["If you had to, which would you change your name to? River,  Bailey  or Charlie", "Choose a form of potatoes: French fries , Tater tots or Cheese Potatoes?", "Choose a style of hat: Beanie or baseball hat"]
};

//initial song combos only for sad mood
const songsForCombos = {
  sad: {empathy : {blackheart: "Thank You Next" , whiteclouds: "Sweetner"},
        wisdom : {blackheart: "Every day", whiteclouds: "Be Alright"},
        manipulation: {blackheart: "Beauty and Beast", whiteclouds: "Focus"}}
};

/********Functions that controls skill's behaviour****************/
function getQuestion(counter, artist_name) {
  console.log("Inside get Question function");
  let artist = artist_name.split(' ').join('');
  console.log(artist);
  let list = questionsForArtists[artist];
  let question = list[counter];
  console.log(question);
  return question;
}

function giveResult() {
  console.log("Inside function for getting result");
  let final_result = "";
  //answer list = ["happy", "empathy", "blackheart"];
  final_result = songsForCombos[answerList[0]][answerList[1]][answerList[2]];
  console.log(final_result);
  return final_result;
}
/********Intent Handlers************/
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Welcome to Song Match. I can help you understand which song by your favorite artist best matches your life. Please tell me the name of your favorite artist.';
    const repromtText = 'Welcome to Song Match..Please tell me the name of your favorite artist.';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromtText)
      .withSimpleCard('Wecome user', speechText)
      .getResponse();
  }
};

const getArtistIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetArtistIntent';
  },
  handle(handlerInput) {
    artist_name = handlerInput.requestEnvelope.request.intent.slots.artist.value;

    console.log(artist_name);
    counter = 0;    //to keep track of the number of questions asked
    let question = getQuestion(counter, artist_name);
    console.log("Returned from getQuestion function");
    const speechText = 'Great, ' + artist_name + '. ' + question;     //asks the first question
    counter += 1;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Get Artist', speechText)
      .getResponse();
  }
};

const getAnswerIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetAnswerIntent';
  },
  handle(handlerInput) {
    let answer = handlerInput.requestEnvelope.request.intent.slots.answer.value;
    answer = answer.toLowerCase();
    answer = answer.split(' ').join('');
    answerList.push(answer);
    console.log(answerList);
    let speechText = "";
    if(counter < 3) {       //decides if further questions needs to be asked
      let question = getQuestion(counter, artist_name);
      speechText = 'Question ' + (counter+1) + ' ' + question;
      counter += 1;
    }
    else {
      speechText = "End of questions. ";
      let song_matched = giveResult();
      console.log(song_matched);
      speechText += "Based on your answers, your " + artist_name + " song match is " + song_matched;
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Get Answer', speechText)
      .reprompt(speechText)
      .getResponse();
  }
};
const RepeatIntentHandler = {
  canHandle(handlerInput) {
    console.log("Inside the can handle repeat handler");
    return  handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent'; 
  },
  handle(handlerInput) {
    console.log("Inside the handle of repeat handler")
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const { lastResponse } = sessionAttributes;
    const speechText = lastResponse;
    console.log(speechText);
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .withShouldEndSession(true)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    //any cleanup logic goes here
    counter = 0;
    artist_name = "";
    answerList = [];
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const saveResponseForRepeatInterceptor = {
  process(handlerInput) {
    console.log("Saving for repeating later");
    const response = handlerInput.responseBuilder.getResponse().outputSpeech.ssml;
    console.log(response);
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.lastResponse = response;
    console.log(sessionAttributes);
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
  },
};

/***********Lambda Handler*********************/
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    getArtistIntentHandler,
    getAnswerIntentHandler,
    HelpIntentHandler,
    RepeatIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler)
  .addResponseInterceptors(saveResponseForRepeatInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();
