const express = require('express');
const passport = require('passport');
const router = express.Router();

router.post('/', passport.authenticate('local'), async (req, res) => {
    try{
        if(req.isAuthenticated()){
            res.status(200).send('Logged in');
        }else{
            res.status(401).send('Unauthorized');
        }
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});


router.post('/logout', async (req, res) => {
    try{
        req.logout();
        res.status(200).send('Logged out');
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

router.get("/get/current/user/", async (req, res) => {
    try{
        if(req.isAuthenticated()){
            res.status(200).send(req.user);
        }else{
            res.status(401).send('Unauthorized');
        }
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

module.exports = router