
// CHAT BOT!!!!, maybe


// key listener for the enter key for the text box
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('userInput').addEventListener('keyup', function (event) {
        event.preventDefault();
        if (event.key === 'Enter') {
            whatSaid();
        }
    });
});

//this is the chat log
const chatLog = [];

//since all the vocabulary is on the server, query the server for an idea
function fillidea() {
    fetch('http://localhost:4000/api/idea')
    .then(res => res.json())
    .then(data => {
        var input = document.getElementById('userInput');
        input.value = data.idea;
    });
}

function whatSaid() {
    var input = document.getElementById('userInput');
    var userInput = input.value.toLowerCase();

    //print out user message
    addToChatLog('user', userInput);

    // clear the input box
    input.value = '';

    //send string to server and get response
    fetch('http://localhost:4000/api',{
        method:'POST',
        body:JSON.stringify({input: userInput}),
        headers: {'Content-type': 'application/json; charset=UTF-8'}
    })
    .then(res => res.json())
    .then(data => {
        const respo =  data.output;
        const frRespo = data.frOutput;
        //print it out
      
        addToChatLog('bot(English)', (respo +"<br> bot(French): "+frRespo));
        spinImage();
      
        
    });
}

{ var spun = false; }
// spin image over a time of 1 second
function spinImage() {
    var image = document.getElementById('Ai');
    if (!spun)
        image.classList.add('spin');
    else
        image.classList.remove('spin');
    spun = !spun;
}


const addToChatLog = (poster, message) => {
    //add to list in Reverse order
    chatLog.unshift({ poster: poster, message: message });

    // replace first h1 tag with h2 for BotRespo
    var h1 = document.getElementById('botRespo');


    var swap;
    //print out
    document.getElementById('botRespo').innerHTML = chatLog.reduce(
        (str, current_message, _) => {
            if (current_message.poster === 'bot(English)'){
                swap = `<h2 class="${current_message.poster}_message">${current_message.poster}: ${current_message.message}</h2>`;
                return str;
            }
            else
                return str + `<p class="${current_message.poster}_message">${current_message.poster}: ${current_message.message}</p>` + swap;  
        },
        ''
    );
    document.getElementById('botRespo').innerHTML = document.getElementById('botRespo').innerHTML.replace('h2', 'h1');
}