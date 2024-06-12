import express, {Application, Express, Router} from "express";
import {ChatCompletionMessageParam} from "openai/resources/chat";
const router = Router();
import {sendPrompt, setupSystemSettings} from '../public/javascripts/openAiFunctions'

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({
      chapter: 1,
      title: "Welcome to Nova Prime",
      story: "Welcome to Nova Prime, a futuristic city located on the distant planet of Xerion. As a new resident, you quickly discover that the city holds many secrets and hidden agendas among its glittering skyscrapers and advanced technology.",
      picture: "./TestImage.png",
      option_1: "Work for a powerful corporation to gain insider knowledge.",
      option_2: "Explore the city's underground network to find the truth.",
      option_3: "Join a rebel group seeking to overthrow the corrupt government."
  });
});

router.get(`/:id`, function(req, res, next) {
    res.send({
        chapter: req.params.id,
        title: "Welcome to Nova Prime",
        story: "Welcome to Nova Prime, a futuristic city located on the distant planet of Xerion. As a new resident, you quickly discover that the city holds many secrets and hidden agendas among its glittering skyscrapers and advanced technology.",
        picture: "./TestImage.png",
        option_1: "Work for a powerful corporation to gain insider knowledge.",
        option_2: "Explore the city's underground network to find the truth.",
        option_3: "Join a rebel group seeking to overthrow the corrupt government."
    });
});

router.post('/choice/:id', async function (req, res, next){
    console.log("Got option ", req.params.id, " from frontend!");
    const response = await sendPrompt(req.params.id, req.body.history);
    res.send(response);
});

router.post('/start', async function (req, res, next) {
    console.log("Got topic from frontend: ", req.body.topic);
    const response = await setupSystemSettings(req.body.topic);
    res.send(response);
});

module.exports = router;
