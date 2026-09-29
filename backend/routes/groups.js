const express = require('express');
const router = express.Router();
const helper = require('../classes/GroupHelper');

router.get('/get/all', async (req, res) => {
    try{
        let groupHelper = new helper();
        let result = await groupHelper.getAllGroups();
        res.status(200).send(result);
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

router.post('/create/', async (req, res) => {
    try{
        let data = req.body;
        let groupHelper = new helper();
        let result = await groupHelper.createGroup(data);
        res.status(200).send('Group created successfully');
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

router.get('/get/members/:syskey', async (req, res) => {
    try{
        let syskey = req.params.syskey;
        let groupHelper = new helper();
        let result = await groupHelper.getMembersForGroup(syskey);
        res.status(200).send(result);
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

router.post('/add/member/', async (req, res) => {
    try{
        let data = req.body;
        let groupHelper = new helper();
        let result = await groupHelper.addMember(data);
        res.status(200).send('Member added successfully');
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

router.post('/remove/member/', async (req, res) => {
    try{
        let data = req.body;
        let groupHelper = new helper();
        let result = await groupHelper.removeMember(data.gm_groupSyskey, data.gm_userSyskey);
        res.status(200).send('Member removed successfully');
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;
