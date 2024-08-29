import {Router} from "express";
const router = Router();
import {sendPrompt, setupGameReplay, setupSystemSettings} from '../public/typescripts/openAiFunctions'
import {validateToken} from "../public/typescripts/jwtUtils";
import {loadChapter, saveGame} from "../public/typescripts/databaseFunctions";

router.post('/choice/:id', validateToken, async function (req, res, next){
    const response = await sendPrompt(req.params.id, req.body.gameEnding, req.body.history);
    res.send(response);
});

router.post('/start', validateToken, async function (req, res, next) {
    const response = await setupSystemSettings(req.body.topic, req.body.chapters);
    res.send(response);
});

router.post('/save', validateToken, async function(req, res, next) {
    const response = await
        saveGame(req.body.token.id, req.body.topic, req.body.chapters);
    if(response) res.status(200).send("Endpoint works!");
    else res.status(500).send("Something went wrong!");
});

router.post('/chapter', validateToken, async function(req, res, next){
    const response = await loadChapter(req.body.game_id, req.body.chapter);
    if(response) res.status(200).send(response);
    else res.status(500);
});

router.post('/replay', validateToken, function(req, res, next) {
    const history = setupGameReplay(req.body.previousChapters, req.body.numberOfChapters);
    res.status(200).send(history);
});

module.exports = router;
