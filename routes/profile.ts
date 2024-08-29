import {Router} from "express";
import {validateToken} from "../public/typescripts/jwtUtils";
import {editAbout, loadGames, loadUserData} from "../public/typescripts/databaseFunctions";
const router = Router();

/* GET home page. */
router.get('/', validateToken, async function(req, res, next) {
    const data = await loadUserData(req.body.token.user);
    res.status(200).send(data);
});

router.post('/editAbout', validateToken, async function (req, res, next) {
    const success = await editAbout(req.body.token.user, req.body.about);
    if(success) res.status(200).send("Edit successful");
    else res.status(500);
});

router.get('/games', validateToken, async function (req, res, next){
    const games = await loadGames(req.body.token.id);
    if(games) res.status(200).send(games);
    else res.status(500);
});

module.exports = router;