const Alexa = require('ask-sdk-core');

const {
  getQuestion,
  giveResult,
  randomGenerator
} = require('./helperFunctions');

const {
  greetings,
  reply,
  songsForErrors,
  WELCOME_TEXT,
  WELCOME_REPROMPT,
  HELP_TEXT,
  THANKYOU_TEXT,
  PLAYAGAIN_TEXT,
  EXIT_TEXT
} = require('./constants');

/****************************Intent Handlers*****************************/
//Function to initialize session attributes
const initAttributes = (handlerInput) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  attributes.artist_name = "";
  attributes.counter = 0;
  attributes.answerList = [];
  return;
};

//Launch Handler
//calls initAttributes and provides the welcome speech
const LaunchRequestHandler = {
  canHandle : (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle : (handlerInput) => {
    console.log(handlerInput);
    initAttributes(handlerInput);
    return handlerInput.responseBuilder
      .speak(WELCOME_TEXT)
      .reprompt(WELCOME_REPROMPT)
      .withSimpleCard('Welcome User', WELCOME_TEXT)
      .withShouldEndSession(false)
      .getResponse();
  }
};

//Artist Handler gets handled when the user provided any artist name
//Gets the user inputted artist's first question. If no such artist exists, it prompts the error handler
const getArtistIntentHandler = {
  canHandle : (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'GetArtistIntent';
  },
  handle : (handlerInput) => {
    const attributes = handlerInput.attributesManager.getSessionAttributes();      //get session attributes
    //console.log(attributes);
    attributes.artist_name = handlerInput.requestEnvelope.request.intent.slots.artist.value; //set the user inputted name to artist name attribute
    //console.log(attributes.artist_name);
    const question = getQuestion(attributes.counter, attributes.artist_name);  //call to get the question for the artist
    //console.log(question);
    if(question == null) {     //If no question is returned, prompt the error handler
      //console.log("inside if handler");
      return ErrorHandler.handle(handlerInput, null);
    }
    
    //If a valid question is returned, it provides the question to the user. 
    
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


//Answer handler to handle the answers given by the user
//Updates the answer list attribute and provides the next question to the user.
const getAnswerIntentHandler = {
  canHandle : (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'GetAnswerIntent';
  },
  handle : (handlerInput) => {
    //console.log("inside handle of get answer intent");
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    
    //prompts error handler, when the answer intent is triggered without getting the artist name.
    
    if(attributes.artist_name == "") {
      return ErrorHandler.handle(handlerInput, null);
    }
    
    //get the value of the answer slot and update it to the answer list
    let answer = handlerInput.requestEnvelope.request.intent.slots.answer.value;
    answer = answer.toLowerCase();   //change to lowercase
    //console.log("1." + answer)
    answer = answer.split(' ').join(''); //join the words if the user provieds multiple words as an answer
    //console.log("2" + answer)
    attributes.answerList.push(answer); //update to answer list
    console.log(attributes.answerList);
    let speechText = "";
    
    //If more questions can be asked -> ask the next question. Max question for each artist is 3 here.
    
    if(attributes.counter < 3) {
      let question = getQuestion(attributes.counter, attributes.artist_name);
      let randomNum = randomGenerator(reply.length);   //to get a random number 
      let randomExpr = reply[randomNum];
      speechText = randomExpr + '. ' + question;
      attributes.counter += 1;
    }
    
    //If all the questions are asked -> provide the user with the song matched based on the answers.
    
    else {
      speechText = THANKYOU_TEXT;
      
      const songMatched = giveResult(attributes.answerList);
      
      //If a song is matched based on the answers, provide the song matched
      
      if (songMatched) {
        speechText += "Based on your answers, your " + attributes.artist_name + " song match is " + "\"" + songMatched + "\". ";
        speechText += PLAYAGAIN_TEXT;
      } 
      
      //If a song is not matched based on the answers provided, prompt the user gracefully
      
      else {
        let randomNum = randomGenerator(songsForErrors.length);  //to get a random number
        let randomSong = songsForErrors[randomNum];
        speechText += "Unfortunately, I couldn't find a song  based on your answers. Here is a song you might like : ";
        speechText += randomSong + ". ";
        speechText += PLAYAGAIN_TEXT;
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


//yes handler to handle when the user says yes to play the song match again
//returns to Launch handler
const yesIntentHandler = {
  canHandle : (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent';
  },
  handle : (handlerInput) => {
    return LaunchRequestHandler.handle(handlerInput);
  }
};

//no handler to handle when the user says no to play the song match again
//returns to cancel and stop handler
const noIntentHandler = {
  canHandle : (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent';
  },
  handle : (handlerInput) => {
    return CancelAndStopIntentHandler.handle(handlerInput);
  }
};

//repeat handler to repeat the last response from Alexa
//get the last response from the session attributes and provides it to user.
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

//help handler gets handled when the user needs help
//provides help message and resets the session attributes.
const HelpIntentHandler = {
  canHandle : (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle : (handlerInput) => {
    console.log("Inside help request handle");
    initAttributes(handlerInput);   //to reset the artist name, answer list and counter
    return handlerInput.responseBuilder
      .speak(HELP_TEXT)
      .reprompt(HELP_TEXT)
      .withSimpleCard('Help user', HELP_TEXT)
      .withShouldEndSession(false)
      .getResponse();
  }
};

//cancel and stop handler handles the exit of the application
//Provides user with exit text
const CancelAndStopIntentHandler = {
  canHandle: (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
  },
  handle: (handlerInput) => {
    
    return handlerInput.responseBuilder
      .speak(EXIT_TEXT)
      .withSimpleCard('Cancel or quit the application', EXIT_TEXT)
      .withShouldEndSession(true)
      .getResponse();
  }
};

//gets handled when the session ends for any reason, other than cancelling or stopping the session.
const SessionEndedRequestHandler = {
  canHandle : (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log("Session ended");
    return handlerInput.responseBuilder.getResponse();
  }
};

//Handed errors and provided the user with a sorry message and prompts whether the user wants to play again
const ErrorHandler = {
  canHandle: () =>  {
    return true;
  },
  handle: (handlerInput, error) => {
    if(error) {
    console.log(`Error handled: ${error.message}`);
    }
    const randomNum = randomGenerator(songsForErrors.length);  //to get a random number
    const randomSong = songsForErrors[randomNum];
    let speechText = "Sorry, I can't find what you're looking for. But here is a song that you might like : \"" + randomSong + "\". ";
    speechText += PLAYAGAIN_TEXT;
    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(false)
      .reprompt(speechText)
      .getResponse();
  },
};

//handles logic to save the response as a session attribute before the execution of the incoming request
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
    yesIntentHandler,
    noIntentHandler,
    HelpIntentHandler,
    RepeatIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler)
  .addResponseInterceptors(saveResponseForRepeatInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();
