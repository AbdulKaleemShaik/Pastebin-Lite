const express = require('express');
const apiController = require('../controllers/pastesApiController');
const publicController = require('../controllers/pastesPublicController');

const apiRouter = express.Router();

// ✅ static route FIRST
apiRouter.get('/healthz', apiController.healthCheck);

// create & fetch pastes
apiRouter.post('/pastes', apiController.createPaste);
apiRouter.get('/pastes/:id', apiController.getPaste);

const publicRouter = express.Router();
publicRouter.get('/:id', publicController.renderPaste);

module.exports = { apiRouter, publicRouter };
