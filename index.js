const Alexa = require('ask-sdk-core');

/**************Constants and variables***************************/
const greetings = ["Great!", "Excellent choice!", "Nice one"];
const reply = ["Got it!", "Okay", "Understood"];
const questionsForArtists = {
  Arianagrande: ["How are you feeling right now? Sad, Anxious  or  Happy?", "What is your best quality? Wisdom, Manipulation or Empathy? ", "Which emoji do you prefer? Black Heart or White Clouds?"],
  Brunomars: ["Choose a place for vacation: Tokyo, Vegas  or  Melbourne ", "How are you feeling right now? Excited, Silly  or  Surprised", "Its friday night!!! You're gonna stay home or hang out?"],
  Billieeilish: ["If you had to, which would you change your name to? River,  Bailey  or Johnny", "Choose a form of potatoes: French fries , Tater tots or Cheese Potatoes?", "Choose a style of hat: Beanie or Cowboy"],
  Charlieputh: ["What is your favorite icecream flavor ? Vanilla, Strawberry or Chocolates", "What is your favorite cuisine ? Italian , Mexican or American", "Which one would you choose : beaches or mountains ?"]
};
const songsForErrors = ["Party in the USA by Miley Cyrus", "Believer by Imagine Dragons", "Low by Flo Rida", "Blank Space by Taylor Swift"];
const songsForCombos = {
  sad: {empathy : {blackheart: "Thank You Next" , whiteclouds: "Sweetner"},
        wisdom : {blackheart: "Every day", whiteclouds: "Be Alright"},
        manipulation: {blackheart: "Beauty and Beast", whiteclouds: "Focus"}},
  anxious: {empathy: {blackheart: "Bad Idea", whiteclouds: "Side to Side"},
            wisdom: {blackheart: "Bang Bang", whiteclouds: "God is a woman"},
            manipulation: {blackheart: "Problem", whiteclouds: "Break free"}},
  happy: {empathy: {blackheart: "Imagine", whiteclouds: "Into You"},
            wisdom: {blackheart: "Love me harder", whiteclouds: "Breathing"},
            manipulation: {blackheart: "Don't call me an Angel", whiteclouds: "The way"}},
  tokyo : {excited: {stayhome: "Uptown Funk", hangout: "Just the way you are"},
          silly: {stayhome: "Grenade", hangout: "When I was your man"},
          surprised: {stayhome: "That's what I like", hangout: "It will rain"}},
  vegas : {excited: {stayhome: "The Lazy song", hangout: "24k magic"},
          silly: {stayhome: "Finesse", hangout: "Locked out of heaven"},
          surprised: {stayhome: "Versace on the floor", hangout: "Treasure"}},
  melbourne : {excited: {stayhome: "Nonthing on you", hangout: "Gorilla"},
          silly: {stayhome: "Billionaire", hangout: "Young, wild and free"},
          surprised: {stayhome: "Please me", hangout: "Young girls"}},
  river : {frenchfries: {beanie: "Bad guy", cowboy: "Ocean eyes"},
          tatertots: {beanie: "Lovely", cowboy: "When the party is over"},
          cheesepotatoes: {beanie: "No time to die", cowboy: "Bury a friend"}},
  bailey : {frenchfries: {beanie: "Everything I wanted", cowboy: "Watch"},
          tatertots: {beanie: "Listen Before I go", cowboy: "Copy cat"},
          cheesepotatoes: {beanie: "Belly ache", cowboy: "Bored"}},
  johnny : {frenchfries: {beanie: "Come out and play", cowboy: "Six feet under"},
          tatertotses: {beanie: "My strange addiction", cowboy: "My boy"},
          cheesepotatoes: {beanie: "Hostage", cowboy: "Fingers crossed"}},
  vanilla : {italian : {beaches: "See you again", mountains: "Attention"},
            mexican : {beaches: "We dont talk anymore", mountains: "One call away"},
            american : {beaches: "How long", mountains: "Done for me"}},
  strawberry : {italian : {beaches: "I warned myself", mountains: "Dangerously"},
            mexican : {beaches: "Mother", mountains: "The way I am"},
            american : {beaches: "Patient", mountains: "Change"}},
  chocolate : {italian : {beaches: "Sober", mountains: "Oops"},
            mexican : {beaches: "Boy", mountains: "If you leave me now"},
            american : {beaches: "Slow it down", mountains: "S"}}
};

/********************Helper Functions**************************************/

//gets the question from the questions list of the artist and returns the question.
function getQuestion(counter, artist_name) {
  console.log("Inside get Question function");
  let artist = artist_name.split(' ').join('');
  console.log(artist);
  let list = questionsForArtists[artist];
  let question = list[counter];
  console.log(question);
  return question;
}

//Function used to map the user inputs to find the "song match". Returns the song matched
function giveResult(answerList) {
  console.log("Inside function for getting result");
  let final_result = "";
  //answer list = ["happy", "empathy", "blackheart"];
  final_result = songsForCombos[answerList.slice(-3)[0]][answerList.slice(-2)[0]][answerList.slice(-1)[0]];
  console.log(final_result);
  return final_result;
}

//function used to generate a random number from 0 to 2
function randomGenerator(max) {
  let randomNum = Math.floor(Math.random() * max);
  return randomNum;
}

/****************************Intent Handlers*****************************/
const LaunchRequestHandler = {
  canHandle : (handlerInput) => {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle : (handlerInput) => {
    console.log(handlerInput);
    const speechText = 'Welcome to Song Match. I can help you understand which song by your favorite artist best matches your life. Please tell me the name of your favorite artist.';
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
    let question = getQuestion(attributes.counter, attributes.artist_name);
    console.log("Returned from getQuestion function");
    let randomNum = randomGenerator(greetings.length);  //to get a random number
    let randomExpr = greetings[randomNum];
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
      let song_matched = giveResult(attributes.answerList);
      console.log(song_matched);
      speechText += "Based on your answers, your " + attributes.artist_name + " song match is " + "\"" + song_matched + "\". ";
      speechText += " Would you like to get another song match from a different artist? ";
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
    const speechText = 'Tell me your favorite artist. I will ask a few questions and at the end I will tell you which song of your favorite ar matches your life.';
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
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    let randomNum = randomGenerator(songsForErrors.length);  //to get a random number
    let randomSong = songsForErrors[randomNum];
    const speechText = "Sorry, an error occured. But here is a song that might match your mood : \"" + randomSong + "\". Please cancel and try running the application again to play song match";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
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

