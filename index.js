const Alexa = require('ask-sdk-core');

import { MongoClient } from "mongodb";

const uri = "mongodb+srv://plebish:H20xLFJPDvxJJy16@cluster0.3pppkdk.mongodb.net/?appName=mongosh+2.2.6"

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db("insertDB");
    const haiku = database.collection("haiku");

    const doc = {
      title: "Record of seojdawd",
      content: "No bytes"
    }
    const result = await haiku.insertOne(doc);

    console.log(`a doc was inserted with the _id: ${result.insertedId}`);
  } finally {
    
    await client.close();
  }
}

const DOCUMENT_ID = "regal-visage";

const datasource = {
  "simpleTextTemplateData": {
    "type": "object",
    "properties": {
      "backgroundImage": "https://d2o906d8ln7ui1.cloudfront.net/images/response_builder/background-green.png",
      "foregroundImageLocation": "top",
      "foregroundImageSource": "https://d28jypdghna36e.cloudfront.net/images/nerd.jpg",
      "headerTitle": "Baldwin I",
      "headerSubtitle": "",
      "hintText": "",
      "headerAttributionImage": "",
      "primaryText": "",
      "textAlignment": "center",
      "titleText": "(ʘᗩʘ')"
    }
  }
};

const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    // Say, "open baldwin"
    const speakOutput = 'I am Baldwin';

    return handlerInput.responseBuilder
      .speak(speakOutput) 
      .getResponse();
  },
};

const APLRequestHandler = {
    canHandle(handlerInput) {
        // handle named intent
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloIntent';
    },
    handle(handlerInput) {
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ID, datasource);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        const speakOutput = `Hello, I'm Baldwin!`; 
    
        // send out skill response
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .getResponse();
    }
};

const DemoDataHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DemoDataIntent';
  },
  handle(handlerInput) {
    
    run().catch(console.dir);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

const MovesListHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayMoveIntent';
  },
  handle(handlerInput) {

    const speakOutput = 'hihi';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};

const HelpHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speakOutput = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};

const CancelAndStopHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speakOutput = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
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
    console.log(error.trace);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    //MovesListHandler,
    //HelloHandler,
    DemoDataHandler,
    HelpHandler,
    CancelAndStopHandler,
    SessionEndedRequestHandler,
    APLRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
