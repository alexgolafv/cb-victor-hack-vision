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

function processMessage(event, sendAnotherMsg) {
    if (!usersCache[event.user]) usersCache[event.user] = {};
    cache = usersCache[event.user];

    

    if(cache.wantFlight || (event.text.toLowerCase().search(/(want)/) !== -1 
            && event.text.toLowerCase().search(/(flight)/) !== -1)) {

        cache.lastQstHelp = false;
        cache.wantFlight = true; 

        setTimeout(() => {
            sendAnotherMsg('Found it. :sunglasses: \nThis flight should be the best choice for you.\n\n '+cache.from+' -> '+cache.to+' Do you want to book it?')
            cache.wantFlight = false; 
        }, 3000)

        return createResponse(`Let me check ...`); 
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
        return createResponse(`Hello ${cache.name || 'there' }! How you doing?`);
    }
    if(cache.lastQstHowAreYou === true && event.text.toLowerCase().search(/(fine|great|good|not bad)/) !== -1 && event.text.toLowerCase().search(/(not happy|not good)/) === -1){
        cache.lastQstHowAreYou = false;
        cache.isGood = true;
        cache.lastQstHelp = !cache.hasLastTrip;
        return createResponse('I\'m happy to hear it! :smile: ' + (cache.hasLastTrip ? 'How was you last flight with Victor?' : 'Can I help you in anyway?'));
    }
    if(cache.lastQstHowAreYou === true && event.text.toLowerCase().search(/(bad|not happy|not good)/) !== -1){
        cache.lastQstHowAreYou = false;
        cache.isGood = false;
        cache.lastQstHelp = !cache.hasLastTrip;
        return createResponse('Oh, really?! ' + (cache.hasLastTrip ? 'Is it about your last flight with Victor?' : 'Can I help you in anyway?'));
    }

    return createResponse('Sorry, I do not understand. ' + (cache.isGood === null ? 'How are you today?' : 'Can I help you in anyway?'));


};