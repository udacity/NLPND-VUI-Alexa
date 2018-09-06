/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');


const facts = [
    "The field of AI is considered to have its origin in 1950, with publication of British mathematician Alan Turing's paper, Computing Machinery and Intelligence.",
    "The term, Artificial Intelligence, was coined in 1956 by mathematician and computer scientist John McCarthy, at Dartmouth College, in New Hampshire.",
    "In 1997, a chess-playing program named Deep Blue, developed by IBM, beat the reigning world chess champion.",
    "A so-called AI Winter occurred in 1974, when funding was cut after Speech Understanding research did not live up to its promise.",
    "A driverless robotic car named Stanley, engineered by Sebastian Thrun's Stanford Racing team, sped through the Mojave desert at 22 miles per hour to win the 2005 Darpa Grand Challenge.",
    "Claude Shannon was born in 1916",
    "Claude Shannon died in 2001",
    "Claude Shannon published A Mathematical Theory of Communication in 1948",
    "Claude Shannon founded digital circuit design theory in 1937",
    "Claude Shannon won the Kyoto Prize in 1985"
];

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent';
  },
  handle(handlerInput) {
    const factArr = facts;
    const factIndex = Math.floor(Math.random() * factArr.length);
    const randomFact = factArr[factIndex];
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};




const GetNewYearFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewYearFactIntent');
  },
  handle(handlerInput) {
    const intent = handlerInput.requestEnvelope.request.intent;
    var returnRandomFact = false;

    // Check that we were provided with a year
    if ((typeof intent !== 'undefined') &&
        (typeof intent.slots !== 'undefined')&&
        (typeof intent.slots.FACT_YEAR !== 'undefined')){

          var year = handlerInput.requestEnvelope.request.intent.slots.FACT_YEAR.value

          var yearFacts = searchYearFact(facts, year)
          if (yearFacts.length > 0)
          {

            var randomFact = randomPhrase(yearFacts);

            // Create speech output
            var speechOutput =  randomFact;
          }
          else
            returnRandomFact = true
    }
    else
      returnRandomFact = true

    if (returnRandomFact){

      var factArr = facts;
      var randomFact = randomPhrase(factArr);
      var speechOutput = randomFact;
    }

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};


function searchYearFact(facts, year){
  // Searches 'facts' for a fact containing a specific 'year'
  // Returns a list of facts for that year, or an empty array
  // if none is found.
  var yearsArr = [];
  for (var i = 0; i < facts.length; i++) {
      var yearFound = grepFourDigitNumber(facts[i], year);
      if (yearFound != null) {
          yearsArr.push(yearFound)
      }
  };
  return yearsArr
}

function grepFourDigitNumber(myString, year) {
  // Searches 'myString' for a specific 'year'
  var txt=new RegExp(year);
    if (txt.test(myString)) {
        return myString;
    }
    else {
        return null
    }
}


function randomPhrase(phraseArr) {
    // Returns a random phrase
    // where phraseArr is an array of string phrases
    var i = 0;
    i = Math.floor(Math.random() * phraseArr.length);
    return (phraseArr[i]);
};



const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'History Facts';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a history fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';


const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    GetNewYearFactHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

exports.facts = facts
