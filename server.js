const express = require('express');
const getResponse = require('./getResponse');
const wiki = require('./wiki');
const server = express();
server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.use('/', express.static('site'));

server.post('/api/', async (req, res) => {

    const input = req.body.input;
    console.log('input: ', input);
    const output = getResponse(input);
    console.log('output: ', output);

    const { translate } = require('bing-translate-api');

    if( wiki.is_question(input)){
       wiki.wikiString(wiki.subject(input)).then(resss =>{
        const  wikiOutput = resss;
        translate(wikiOutput, null, 'fr', true).then(ress => {
            
            console.log(ress.translation);
            const frOutput = ress.translation;
            
            
            res.json({output: wikiOutput, frOutput: frOutput});

        }).catch(err => {
            console.error(err);
        });
       }).catch(errr => {
            console.error(errr);
       });

    }else{

        translate(output, null, 'fr', true).then(ress => {
            
            console.log(ress.translation);
            const frOutput = ress.translation;
            
            
            res.json({output: output, frOutput: frOutput});

        }).catch(err => {
            console.error(err);
        });

    }
});

server.get('/api/idea', (req, res) => {
    const idea = getResponse.getIdea();
    res.json({idea: idea});
});

server.post('/api/sentiment', (req, res) => {
    const input = req.body.input;
    console.log('input: ', input);
    const sentiment = getResponse.analyzeSentiment(input);
    console.log('sentiment: ', sentiment);
    res.json({sentiment: sentiment});
});

server.post('/api/stem', (req, res) => {
    const input = req.body.input;
    console.log('input: ', input);
    const stemmed = getResponse.stemInput(input);
    console.log('stemmed: ', stemmed);
    res.json({stemmed: stemmed});
});

server.post('/api/pos', (req, res) => {
    const input = req.body.input;
    console.log('input: ', input);
    const pos = getResponse.posTagger(input);
    console.log('pos: ', pos);
    res.json(pos);
});

server.listen(4000, () => {
    console.log('server running...');
});