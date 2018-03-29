const when = require('when');
const mongoose = require('mongoose');
const feedback = require("./resources/flight-feedback")

module.exports = {

    processMessage: processMessage,

};

const usersCache = {};
init();

function init(){
    mongoose.Promise = require('bluebird');
    mongoose.connect('mongodb://localhost/slackbot', { useMongoClient: true, promiseLibrary: require('bluebird') })
      .then(() =>  console.log('connection succesful'))
      .catch((err) => console.error(err));
}

function createResponse(text){
    return when.resolve({
        text: text,
    });
}

function processMessage(event, sendAnotherMsg) {
    console.log('process')
    if (!usersCache[event.user]) usersCache[event.user] = {};
    cache = usersCache[event.user];
    var response = "";
    

    if(cache.wantFlight || (event.text.toLowerCase().search(/(want)/) !== -1 
            && event.text.toLowerCase().search(/(flight)/) !== -1)) {

        cache.lastQstHelp = false;
        cache.wantFlight = true; 

        setTimeout(() => {
            sendAnotherMsg('Found it. :sunglasses: \nThis flight should be the best choice for you.\n\n '+cache.from+' -> '+cache.to+' Do you want to book it?')
            cache.wantFlight = false; 
        }, 3000)
        response = `Let me check ...`;
        flightFeedback(event, usersCache[event.user], event.text, response);
        //return createResponse(`Let me check ...`); 
    }


    if(event.text.toLowerCase().search(/(hello|goodmorning|hi|hey)/) !== -1){
        
        usersCache[event.user] = {
            isNameRequested: false, 
            lastQstHowAreYou: null,
            lastQstHelp: false,
            isGood: null,
            wantFlight: false,
            from: null, 
            to: null, 
            hasLastTrip: event.user === 'U9XCZ33EU',
            name: (event.user === 'U9XCWJPJ4' || event.user === 'U9XCZ33EU') ? 'Neelima' : event.user === 'U9Y8JQ80M' ? 'Meg' : null,
            isLogged: false, 
        };

        cache = usersCache[event.user] 
        cache.lastQstHowAreYou = true;
        cache.isLogged = cache.name !== null;

        console.log(event.user);
        response = `Hello ${cache.name || 'there' }! How you doing?`;
       // return createResponse(`Hello ${cache.name || 'there' }! How you doing?`);
    }
    if(cache.lastQstHowAreYou === true && event.text.toLowerCase().search(/(fine|great|good|not bad)/) !== -1 && event.text.toLowerCase().search(/(not happy|not good)/) === -1){
        cache.lastQstHowAreYou = false;
        cache.isGood = true;
        cache.lastQstHelp = !cache.hasLastTrip;
        response = 'I\'m happy to hear it! :smile: ' + (cache.hasLastTrip ? 'How was you last flight with Victor?' : 'Can I help you in anyway?');
        //return createResponse('I\'m happy to hear it! :smile: ' + (cache.hasLastTrip ? 'How was you last flight with Victor?' : 'Can I help you in anyway?'));
    }
    if(cache.lastQstHowAreYou === true && event.text.toLowerCase().search(/(bad|not happy|not good)/) !== -1){
        cache.lastQstHowAreYou = false;
        cache.isGood = false;
        cache.lastQstHelp = !cache.hasLastTrip;
        response = 'Oh, really?! ' + (cache.hasLastTrip ? 'Is it about your last flight with Victor?' : 'Can I help you in anyway?');
        //return createResponse('Oh, really?! ' + (cache.hasLastTrip ? 'Is it about your last flight with Victor?' : 'Can I help you in anyway?'));
    }
    flightFeedback(event, usersCache[event.user], event.text, response);
    if(response){
        return createResponse(response);
    } else {
        return createResponse('Sorry, I do not understand. ' + (cache.isGood === null ? 'How are you today?' : 'Can I help you in anyway?'));
        
    }


};

var flightFeedback = (channel,userDetails, word, response) => {
    feedback.create({
        user_id:userDetails.id,
        feedbackMessage:word,
        response: response,
        chatStatus:userDetails
    }, (err, post) => {
      if (err) {
        console.log(err);
        return;
      } else {
       console.log("feedback created")
      }
    });
  }
  /*
=======
function init(){
    mongoose.Promise = require('bluebird');
    mongoose.connect('mongodb://localhost/slackbot', { useMongoClient: true, promiseLibrary: require('bluebird') })
      .then(() =>  console.log('connection succesful'))
      .catch((err) => console.error(err));
}

function processMessage(event) {
    if (!usersCache[event.user]) usersCache[event.user] = {
        isNameRequested: false
    };
    if(event.text.toLowerCase().search(/(hello|goodmorning|hi|hey)/) !== -1){
        flightFeedback(event, usersCache[event.user], event.text);
        return createResponse('Hello there! How you doing?');
    }
    return createResponse('Sorry, I do not understand.');
};

var flightFeedback = (channel,user, word) => {
    feedback.create({user_id:user.id,feedbackMessage:word}, (err, post) => {
      if (err) {
        console.log(err);
        return;
      } else {
       console.log("feedback created")
      }
    });
  }
*/