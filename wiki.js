const axios = require('axios').default;
const querystring = require('querystring');
const identifiers = ['what', 'who', 'explain', 'tell', 'me'];
const universals = ['is', 'are', 'a', 'an', 'the', 'about', 'of', 'was'];

//Determin if user input is a quenstion or not
function is_question(userInput) {
    userInput = userInput.toLowerCase().split(' ');

    //user input has 1 identifier
    return userInput.some(word => identifiers.includes(word));
}

// change the question into a topic for wiki to use 
function subject(userInput) {
    userInput = userInput.toLowerCase().split(' ');

    //remove most of statement till verbs and nouns are left
    while (userInput.length > 0 && (identifiers.includes(userInput[0]) || universals.includes(userInput[0]))) {
        userInput.shift();
    }
    // the extra words left
    while (userInput.length > 0 && (identifiers.includes(userInput[userInput.length - 1]) || universals.includes(userInput[userInput.length - 1]))) {
        userInput.pop();
    }

    return userInput.join(' ').replace(/[?.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
}

//get a breif disprection on the topic from wiki
async function wikiString(subject) {
    query_str = 'https://www.wikipedia.org/w/api.php?' + querystring.encode({ action: 'query', list: 'search', srsearch: subject, srprop: 'snippet', format: 'json', srlimit: 1 });

    //query wikipedia api
    const response = await axios.get(query_str).then(response => response.data.query.search);

    if (response && response[0]) {
        //remove all the HTML tags and sentences after the first one
        const description = response[0].snippet.replace(/<\/?[^>]+(>|$)/g, '').split('.')[0];
        return description;
    } else {
        return undefined;
    }
}

module.exports.is_question = is_question;
module.exports.subject = subject;
module.exports.wikiString = wikiString;