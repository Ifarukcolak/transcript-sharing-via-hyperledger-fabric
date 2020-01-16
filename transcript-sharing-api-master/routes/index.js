var express = require('express');
var router = express.Router();
const { getContract } = require('../helper/ledger-helper');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
* @swagger
* /login:
*   post:
*     tags:
*       - index
*     name: login
*     summary: checks user certificate
*     consumes:
*       - application/json
*     parameters:
*       - name: username
*         in: header
*         required:
*           - username
*       - name: organization_name
*         in: query
*         required:
*           - organization_name
*     responses:
*       200:
*         description: user certificate is valid
*       401:
*         description: Unauthorized
*/
router.post('/login', async function (req, res, next) {
  let result = await getContract(req.headers.username, req.query.organization_name);
  console.log('result is :',result);
  if (result == null) {
    res.status(401).json({ status: false, message: 'Authentication error!' })
    return;
  } else {
    res.status(200).json({ status: true, message: 'Login Success!' })

  }
});

module.exports = router;
