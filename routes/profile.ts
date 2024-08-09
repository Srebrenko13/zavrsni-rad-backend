import {Router} from "express";
import {validateToken} from "../public/typescripts/jwtUtils";
import {loadUserData} from "../public/typescripts/databaseFunctions";
const router = Router();

/* GET home page. */
router.get('/', validateToken, async function(req, res, next) {
    console.log("Got into profile getter.");
    const data = await loadUserData(req.body.token.user);
    res.status(200).send(data);
});

module.exports = router;