const express = require('express');
const router = express.Router();
const { getContract, registerUser } = require('../helper/ledger-helper');
const {gpaCalculator}= require('../helper/gpa-calculator');

/**
* @swagger
* /ytu:
*   get:
*     tags:
*       - ytu
*     name: get transcripts
*     summary: returns all transcripts
*     consumes:
*       - application/json
*     parameters:
*       - name: username
*         in: header
*         required:
*           - username
*     responses:
*       200:
*         description: returns all transcripts
*       401:
*         description: Unauthorized
*/
router.get('/', async function (req, res, next) {
  let result = await getContract(req.headers.username, 'ytu');
  if (await  result == null) {
    res.status(401).json({ status: false, message: 'Authentication error!' })
    return;
  }

  const response = await result.contract.evaluateTransaction('queryAllTranscripts');
  await result.gateway.disconnect();
  res.json(response.toString());
  console.log(`Transaction has been evaluated, result is: ${response.toString()}`);
});

/**
* @swagger
* /ytu/one:
*   get:
*     tags:
*       - ytu
*     name: get transcript
*     summary: returns transcript according to ID
*     consumes:
*       - application/json
*     parameters:
*       - name: identity_number
*         in: query
*         schema:
*          type: Number
*       - name: username
*         in: header
*         required:
*           - username
*     responses:
*       200:
*         description: returns all transcripts
*       401:
*         description: Unauthorized
*/
router.get('/one', async function (req, res, next) {
  let result = await getContract(req.headers.username, 'ytu');
  if ( result == null) {
    res.status(401).json({ status: false, message: 'Authentication error!' })
    return;
  }

  let response = await result.contract.evaluateTransaction('queryTranscript', req.query.identity_number);
  await result.gateway.disconnect();
  console.log('Response is sending to the gpaCalculator')
  
  response = gpaCalculator(JSON.parse(JSON.parse(JSON.stringify('['+response.toString()+']'))));
  console.log('gpaCalculator process is finished')
  res.json(response);
  console.log(`Transaction has been evaluated, result is: ${response.toString()}`);
});

/**
* @swagger
* /ytu/one/history:
*   get:
*     tags:
*       - ytu
*     name: get history 
*     summary: returns history according to ID
*     consumes:
*       - application/json
*     parameters:
*       - name: identity_number
*         in: query
*         schema:
*          type: Number
*       - name: username
*         in: header
*         required:
*           - username
*     responses:
*       200:
*         description: returns history
*       401:
*         description: Unauthorized
*/
router.get('/one/history', async function (req, res, next) {
  let result = await getContract(req.headers.username, 'ytu');
  if ( result == null) {
    res.status(401).json({ status: false, message: 'Authentication error!' })
    return;
  }

  let response = await result.contract.evaluateTransaction('queryTranscript', req.query.identity_number);
  await result.gateway.disconnect();
  console.log('Response is sending to the gpaCalculator')
  response = gpaCalculator(JSON.parse(JSON.parse(JSON.stringify(response.toString()))));
  console.log('gpaCalculator process is finished')
  res.json(response);
  console.log(`Transaction has been evaluated, result is: ${response.toString()}`);
});

/**
* @swagger
* /ytu:
*   post:
*     tags:
*       - ytu
*     name: Add
*     summary: add new transcript 
*     consumes:
*       - application/json
*     parameters:
*       - name: username
*         in: header
*         required:
*           - username
*       - name: Transcript
*         in: body   
*         schema:    
*           type: object
*           properties:
*             IdentityNumber:
*               type: string
*             UniversityName:
*               type: string
*             UniversityId:
*               type: string
*             Department:
*               type: string
*             Name:
*               type: string
*             Surname:
*               type: string
*             Period:
*               type: string
*             BirthDate:
*               type: string
*             BirthPlace:
*               type: string
*             FatherName:
*               type: string
*             RegistryDate:
*               type: string
*             RegistryType:
*               type: string
*             Lectures:
*               type: Array
*         required:
*           - IdentityNumber
*           - UniversityName
*           - UniversityId
*           - Department
*           - Name
*           - Surname
*           - Period
*           - BirthDate
*           - BirthPlace
*           - FatherName
*           - RegistryDate
*           - RegistryType
*           - Lectures
*     responses:
*       200:
*         description: registering transcript is successfull
*       400:
*         description: bad request
*/
router.post('/', async function (req, res, next) {
  let result = await getContract(req.headers.username, 'ytu');
  if ( result == null) {
    res.status(401).json({ status: false, message: 'Authentication error!' })
    return;
  }
  console.log('request body : ', req.body);
  const response = await result.contract.submitTransaction('createTranscript', req.body.IdentityNumber,
    req.body.UniversityName,
    req.body.UniversityId,
    req.body.Department,
    req.body.Name,
    req.body.Surname,
    req.body.Period,
    req.body.BirthDate,
    req.body.BirthPlace,
    req.body.FatherName,
    req.body.RegistryDate,
    req.body.RegistryType,
    JSON.stringify(req.body.Lectures));

  await result.gateway.disconnect();
  res.json(response.toString());
  console.log(`Transaction has been evaluated, result is: ${response.toString()}`);
})

/**
* @swagger
* /itu:
*   patch:
*     tags:
*       - itu
*     name: Add
*     summary: update transcript 
*     consumes:
*       - application/json
*     parameters:
*       - name: identity_number
*         in: query
*         schema:
*          type: Number
*       - name: username
*         in: header
*         required:
*           - username
*       - name: Transcript
*         in: body   
*         schema:    
*           type: object
*           properties:
*             Lectures:
*               type: Array
*     responses:
*       200:
*         description: update transcript is successfull
*       400:
*         description: bad request
*/
router.patch('/', async function (req, res, next) {
  let result = await getContract(req.headers.username, 'ytu');
  if ( result == null) {
    res.status(401).json({ status: false, message: 'Authentication error!' })
    return;
  }
  const response = await result.contract.submitTransaction('updateLectures', req.query.identity_number,
    JSON.stringify(req.body.Lectures));

  await result.gateway.disconnect();
  res.json(response.toString());
  console.log(`Transaction has been evaluated, result is: ${response.toString()}`);
})

/**
* @swagger
* /ytu/register-user:
*   post:
*     tags:
*       - ytu
*     name: register user
*     summary: register user using admin wallet
*     consumes:
*       - application/json
*     parameters:
*       - name: username
*         in: header
*         required:
*           - username
*     responses:
*       200:
*         description: wallet is created according to username
*       401:
*         description: Unauthorized
*/
router.post('/register-user', async function (req, res, next) {
  const result =await registerUser(req.headers.username, 'ytu')

  if (result.isSuccess)
    res.json({ status: true, message: result.message });
  else
    res.status(500).json({ status: false, message: result.message })
});

module.exports = router;
