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


    if(cache.lastQstHelp === true) {
        cache.lastQstHelp = false;
        setTimeout(() => {
            sendAnotherMsg('/yesno Found it. This flight should be the best choice for you. Do you want to book it? LND -> MIL 2018-02-02', 3000)
        })
        return createResponse(`Let me check ...`); 
    }


    if(event.text.toLowerCase().search(/(hello|goodmorning|hi|hey)/) !== -1){
        usersCache[event.user] = {
            isNameRequested: false, 
            lastQstHowAreYou: null,
            lastQstHelp: false,
            isGood: true,
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
        cache.lastQstHowAreYou === false;
        cache.isGood = true;
        cache.lastQstHelp = !cache.hasLastTrip;
        return createResponse('I\'m happy to hear it! ' + (cache.hasLastTrip ? 'How was you last flight with Victor?' : 'Can I help you in anyway?'));
    }
    if(cache.lastQstHowAreYou === true && event.text.toLowerCase().search(/(bad|not happy|not good)/) !== -1){
        cache.lastQstHowAreYou === false;
        cache.isGood = false;
        cache.lastQstHelp = !cache.hasLastTrip;
        return createResponse('Oh, really?! ' + (cache.hasLastTrip ? 'Is it about your last flight with Victor?' : 'Can I help you in anyway?'));
    }




    return createResponse('Sorry, I do not understand.');
};