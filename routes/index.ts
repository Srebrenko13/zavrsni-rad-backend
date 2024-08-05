import express, {Application, Express, Router} from "express";
import {handleLogin} from "../public/typescripts/userAndGameFunctions";
const router = Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', async function(req, res, next){
  console.log("Got login information from frontend!\nUsername: " + req.body.username + "\nPassword: " + req.body.password);
  const response = await handleLogin(req.body.username, req.body.password);
  res.send(response);
});

module.exports = router;
