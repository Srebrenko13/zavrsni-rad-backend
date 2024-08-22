import {Router} from "express";
const router = Router();
import {sendPrompt, setupSystemSettings} from '../public/typescripts/openAiFunctions'

router.post('/choice/:id', async function (req, res, next){
    console.log("Got option ", req.params.id, " in chapter", req.body.chapter,  " from frontend!");
    const response = await sendPrompt(req.params.id, req.body.chapter, req.body.history);
    res.send(response);
});

router.post('/start', async function (req, res, next) {
    console.log("Got topic from frontend: ", req.body.topic, "\nAnd ", req.body.chapters, " chapters.");
    const response = await setupSystemSettings(req.body.topic, req.body.chapters);
    res.send(response);
});

module.exports = router;
