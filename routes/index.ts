import {Router} from "express";
import {handleLogin, handleRegister} from "../public/typescripts/userAndGameFunctions";
import {Utils} from "../public/typescripts/utils";
import {generateToken} from "../public/typescripts/jwtUtils";
const router = Router();

import {getPictureFromApi} from "../public/typescripts/openAiFunctions";
import axios from "axios";

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/login', async function(req, res, next){
    const response = await handleLogin(req.body);
    if(Utils.isAccountData(response)){
        res.status(200).send(generateToken({user: response.username, id: response.id}));
    } else{
        if(response.otherError === true) res.status(500).send(response);
        else res.status(401).send(response);
    }
});

router.get('/test', async function(req, res, next){
    const link = await getPictureFromApi("English bulldog");
    const image = axios.get(link, {responseType: 'blob'}).then(response => {
        return response;
    })
    res.writeHead(200, { 'content-type': 'image/jpeg' })
    res.end(image, 'base64');
});

router.post('/register', async function (req, res, next) {
    const response = await handleRegister(req.body);
    if(Utils.isAccountData(response)){
        res.status(201).send(generateToken({user: response.username, id: response.id}));
    } else{
        if(response.otherError === true) res.status(500).send(response);
        else res.status(409).send(response);
    }
});

module.exports = router;
