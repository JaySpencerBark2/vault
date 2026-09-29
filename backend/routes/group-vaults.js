const express = require('express');
const router = express.Router();
const groupHelper = require('../classes/GroupHelper');
const vaultHelper = require('../classes/VaultHelper');

router.get('/get/my/groups/:userSyskey', async (req, res) => {
    try{
        let userSyskey = req.params.userSyskey;
        let helper = new groupHelper();
        let result = await helper.getGroupsForUser(userSyskey);
        res.status(200).send(result);
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

router.get('/get/all/:userSyskey', async (req, res) => {
    try{
        let userSyskey = req.params.userSyskey;
        let helper = new groupHelper();
        let groups = await helper.getGroupsForUser(userSyskey);
        let groupSyskeys = groups.map(g => g.gr_groupSyskey);
        let vHelper = new vaultHelper();
        let result = await vHelper.getGroupVaultInstances(groupSyskeys);
        res.status(200).send(result);
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;
