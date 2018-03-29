const when = require('when');
module.exports = {
    processMessage: processMessage,
};

const usersCache = {};

function createResponse(text){
    return when.resolve({
        text: text,
    });
}

function processMessage(event) {
console.log('asdasdasd', event);
    if (!usersCache[event.user]) usersCache[event.user] = {
        isNameRequested: false, 
        lastQstHowAreYou: null,
        helpQuestionMake: false,
        isGood: true,
        hasLastTrip: event.user === 'U9XCZ33EU',
    };
    cache = usersCache[event.user];


    if(event.text.toLowerCase().search(/(hello|goodmorning|hi|hey)/) !== -1){
        cache.lastQstHowAreYou = true;
        return createResponse('Hello there! How you doing?');
    }


    if(cache.lastQstHowAreYou === true && event.text.toLowerCase().search(/(fine|great|good|not bad)/) !== -1 && event.text.toLowerCase().search(/(not happy|not good)/) === -1){
        cache.lastQstHowAreYou === false;
        cache.isGood = true;
        return createResponse('I\'m happy to hear it! ' + (cache.hasLastTrip ? 'How was you last flight with Victor?' : 'Can I help you in anyway?'));
    }


    if(cache.lastQstHowAreYou === true && event.text.toLowerCase().search(/(bad|not happy|not good)/) !== -1){
        cache.lastQstHowAreYou === false;
        cache.isGood = true;
        return createResponse('Oh, really?! ' + (cache.hasLastTrip ? 'Is it about your last flight with Victor?' : 'Can I help you in anyway?'));
    }




    return createResponse('Sorry, I do not understand.');
};