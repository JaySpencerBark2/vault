const express = require('express');
const router = express.Router();
const helper = require('../classes/UserHelper');

router.get('/get/all', async (req, res) => {
    try{
        let userHelper = new helper();
        let result = await userHelper.getAllUsers();
        res.status(200).send(result);
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

router.post('/create/', async (req, res) => {
    try{
        let data = req.body;
        let userHelper = new helper();
        let result = await userHelper.createUser(data);
        res.status(200).send('User created successfully');
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

router.post('/delete/:syskey', async (req, res) => {
    try{
        let syskey = req.params.syskey;
        let userHelper = new helper();
        let result = await userHelper.deleteUser(syskey);
        res.status(200).send('User deleted successfully');
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

router.post('/toggle/admin/:syskey', async (req, res) => {
    try{
        let syskey = req.params.syskey;
        let userHelper = new helper();
        let result = await userHelper.toggleAdmin(syskey, req.body.admin);
        res.status(200).send('User updated successfully');
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;
