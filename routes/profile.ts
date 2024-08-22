import {Router} from "express";
import {validateToken} from "../public/typescripts/jwtUtils";
import {editAbout, loadUserData} from "../public/typescripts/databaseFunctions";
const router = Router();

/* GET home page. */
router.get('/', validateToken, async function(req, res, next) {
    console.log("Got into profile getter.");
    const data = await loadUserData(req.body.token.user);
    res.status(200).send(data);
});

router.post('/editAbout', validateToken, async function (req, res, next) {
    console.log("Got edit about request: ", req.body.about);
    const success = await editAbout(req.body.token.user, req.body.about);
    if(success) res.status(200).send("Edit successful");
    else res.status(500);
});

module.exports = router;