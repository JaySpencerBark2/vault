const express = require('express');
const router = express.Router();
const helper = require('../classes/VaultHelper');

router.get('/get/all/:id', async (req, res) => {
    try{
        let syskey = req.params.id;
        let vaultHelper = new helper();
        let result = await vaultHelper.getAllVaultInstances(syskey);
        res.status(200).send(result);
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

router.get('/get/line/:id', async (req, res) => {
  try{
    let syskey = req.params.id;
    let vaultHelper = new helper();
    let result = await vaultHelper.getVaultLines(syskey);
    res.status(200).send(result);
  }catch(e){
    res.status(500).send({ error: e.message });
  }
});


router.post('/create/', async  (req, res) => {
    try{
        let data = req.body;
        let vaultHelper = new helper();
        let result = await vaultHelper.createVaultInstance(data);
        res.status(200).send('Vault created successfully');
    }catch(e){
        console.log(e);
        res.status(500).send(e);
    }
});

router.post('/unlock/', async (req, res) => {
    try {
      let data = req.body.payload;
      let vaultHelper = new helper();
      let result = await vaultHelper.unlockVault(data);
      if (result === true) {
        res.status(200).send('Vault unlocked successfully');
      } else {
        res.status(401).send('Invalid password');
      }
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  });

router.post('/create/line/:HeaderSyskey', async (req, res) => {
  try{
    let data = req.body;
    data.headerSyskey = req.params.HeaderSyskey;
    let vaultHelper = new helper();
    let result = await vaultHelper.CreateVaultRecord(data);
    res.status(200).send('Vault line created successfully');

  }catch(e){
    res.status(500).send({ error: e.message });
  }
});

router.post('/update/line/:syskey', async (req, res) => {
  try{
    let syskey = req.params.syskey;
    let data = req.body;
    let vaultHelper = new helper();
    let result = await vaultHelper.updateVaultRecord(syskey, data);
    res.status(200).send('Vault line updated successfully');
  }catch(e){
    res.status(500).send({ error: e.message });
  }
});

router.delete('/delete/line/:syskey', async (req, res) => {
  try {
    let syskey = req.params.syskey;
    let vaultHelper = new helper();
    let result = await vaultHelper.deleteVaultLine(syskey);
    res.status(200).send('Vault line deleted successfully');
  } catch (e) {
    res.status(500).send({ error: e.message }); 
  }
});



module.exports = router;