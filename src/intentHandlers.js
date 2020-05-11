const Alexa = require('ask-sdk-core');
const {
  getQuestion,
  giveResult,
  randomGenerator
} = require('./helperFunctions');

const {
  greetings,
  reply,
  songsForErrors
} = require('./constants');

/****************************Intent Handlers*****************************/
const LaunchRequestHandler = {
  canHandle : (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle : (handlerInput) => {
    console.log(handlerInput);
    const speechText = 'Welcome to Song Match. I can help you understand which song, by your favorite artist, best matches your life. Please tell me the name of your favorite artist.';
    const repromtText = 'Welcome to Song Match..Please tell me the name of your favorite artist.';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromtText)
      .withSimpleCard('Welcome User', speechText)
      .withShouldEndSession(false)
      .getResponse();
  }
};

const getArtistIntentHandler = {
  canHandle : (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'GetArtistIntent';
  },
  handle : (handlerInput) => {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    console.log(attributes);
    attributes.artist_name = handlerInput.requestEnvelope.request.intent.slots.artist.value;
    //console.log(artist_name);
    attributes.counter = 0;
    attributes.answerList = [];
    const question = getQuestion(attributes.counter, attributes.artist_name);
    //console.log("Returned from getQuestion function");
    const randomNum = randomGenerator(greetings.length);  //to get a random number
    const randomExpr = greetings[randomNum];
    const speechText = randomExpr + '! ' + attributes.artist_name + '. ' + question;
    attributes.counter += 1;
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Get Artist', speechText)
      .reprompt(speechText)
      .withShouldEndSession(false)
      .getResponse();
  }
};

const getAnswerIntentHandler = {
  canHandle : (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'GetAnswerIntent';
  },
  handle : (handlerInput) => {
    //console.log("inside handle of get answer intent");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let answer = handlerInput.requestEnvelope.request.intent.slots.answer.value;
    answer = answer.toLowerCase();
    //console.log("1." + answer)
    answer = answer.split(' ').join('');
    //console.log("2" + answer)
    attributes.answerList.push(answer);
    console.log(attributes.answerList);
    let speechText = "";
    if(attributes.counter < 3) {
      let question = getQuestion(attributes.counter, attributes.artist_name);
      let randomNum = randomGenerator(reply.length);   //to get a random number 
      let randomExpr = reply[randomNum];
      speechText = randomExpr + '. ' + question;
      attributes.counter += 1;
    }
    else {
      speechText = "Thanks for answering the questions... ";
      
      const songMatched = giveResult(attributes.answerList);
      if (songMatched) {
        speechText += "Based on your answers, your " + attributes.artist_name + " song match is " + "\"" + songMatched + "\". ";
        speechText += " Would you like to get another song match from a different artist? ";
      } else {
        let randomNum = randomGenerator(songsForErrors.length);  //to get a random number
        let randomSong = songsForErrors[randomNum];
        speechText += "Unfortunately, I couldn't find a song  based on your answers. Here is a song you might like : ";
        speechText += randomSong + ". ";
        speechText += " Would you like to get another song match from a different artist? ";
      }
      
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Get Answer', speechText)
      .reprompt(speechText)
      .withShouldEndSession(false)
      .getResponse();
  }
};

const getPlayAgainIntentHandler = {
  canHandle : (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'GetPlayAgainIntent';
  },
  handle : (handlerInput) => {
    if(handlerInput.requestEnvelope.request.intent.slots.yes.value != null) {
      return LaunchRequestHandler.handle(handlerInput);
    }
    else {
      return  CancelAndStopIntentHandler.handle(handlerInput);
    }
  }
};
const RepeatIntentHandler = {
  canHandle : (handlerInput) => {
    console.log("Inside the can handle repeat handler");
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.RepeatIntent'; 
  },
  handle : (handlerInput) => {
    console.log("Inside the handle of repeat handler");
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const { lastResponse } = sessionAttributes;
    const speechText = lastResponse;
    console.log(speechText);
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle : (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle : (handlerInput) => {
    console.log("Inside help request handle");
    const speechText = 'Tell me your favorite artist. I will ask a few questions and at the end I will tell you which song of your favorite artist best matches your life.';
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Help user', speechText)
      .withShouldEndSession(false)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle: (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
  },
  handle: (handlerInput) => {
    const speechText = 'Thank you for using Song Match. For another great skill, check out Song Quiz!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Cancel or quit the application', speechText)
      .withShouldEndSession(true)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle : (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log("cleaning up");
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle: () =>  {
    return true;
  },
  handle: (handlerInput, error) => {
    console.log(`Error handled: ${error.message}`);
    const randomNum = randomGenerator(songsForErrors.length);  //to get a random number
    const randomSong = songsForErrors[randomNum];
    const speechText = "Sorry, I can't find what you're looking for. But here is a song that might like : \"" + randomSong + "\". Please cancel and try running the application again to play song match";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const saveResponseForRepeatInterceptor = {
  process: (handlerInput) => {
    console.log("Saving for repeating later");
    const response = handlerInput.responseBuilder.getResponse().outputSpeech.ssml;
    console.log(response);
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.lastResponse = response;
    console.log(sessionAttributes);
    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
  },
};

/**************************Lambda Handler*********************/
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    getArtistIntentHandler,
    getAnswerIntentHandler,
    getPlayAgainIntentHandler,
    HelpIntentHandler,
    RepeatIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler)
  .addResponseInterceptors(saveResponseForRepeatInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();

