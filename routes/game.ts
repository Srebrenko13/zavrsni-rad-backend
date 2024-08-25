import {Router} from "express";
const router = Router();
import {sendPrompt, setupSystemSettings} from '../public/typescripts/openAiFunctions'
import {validateToken} from "../public/typescripts/jwtUtils";
import {saveGame} from "../public/typescripts/databaseFunctions";

router.post('/choice/:id', validateToken, async function (req, res, next){
    console.log("Got option ", req.params.id, ", game should end: ", req.body.gameEnding);
    const response = await sendPrompt(req.params.id, req.body.gameEnding, req.body.history);
    res.send(response);
});

router.post('/start', validateToken, async function (req, res, next) {
    console.log("Got topic from frontend: ", req.body.topic, "\nAnd ", req.body.chapters, " chapters.");
    const response = await setupSystemSettings(req.body.topic, req.body.chapters);
    res.send(response);
});

router.post('/save', validateToken, async function(req, res, next) {
    console.log("Got game to save\nTopic: ", req.body.topic, "\nNumber of chapters: ", req.body.numberOfChapters,
        "\nChapters: ", req.body.chapters, "\nUserid: ", req.body.token.id, "\nOptions: ", req.body.chosenOptions);

    const response = await
        saveGame(req.body.token.id, req.body.topic, req.body.numberOfChapters, req.body.chapters, req.body.chosenOptions);
    if(response) res.status(200).send("Endpoint works!");
    else res.status(500).send("Something went wrong!0");
});

module.exports = router;
