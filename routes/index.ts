import express, {Application, Express, Router} from "express";
import {handleLogin, handleRegister} from "../public/typescripts/userAndGameFunctions";
const router = Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/login', async function(req, res, next){
    console.log("Got login information from frontend!\nUsername: " + req.body.user + "\nPassword: " + req.body.passwordHash);
    const response = await handleLogin(req.body.user, req.body.passwordHash);
    res.send(response);
});

router.post('/register', async function (req, res, next) {
    console.log("Got register information from frontend!\nUsername: " + req.body.user + "\nEmail: " + req.body.email
    + "\nPassword: " + req.body.passwordHash);
    const response = await handleRegister(req.body.username, req.body.email, req.body.password);
    res.send(response);
});

module.exports = router;
