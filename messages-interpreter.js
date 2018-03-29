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
    if (!usersCache[event.user]) usersCache[event.user] = {};

    if(event.text.toLowerCase().indexOf('hello') !== -1){
        return createResponse('Hello there! How you doing?');
    }


    return createResponse('Sorry, I do not understand.');
};