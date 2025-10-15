const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');

// GET /api/competition/lanes - Get number of lanes
router.get('/lanes', competitionController.getNumLanes);

// POST /api/competition/lanes - Set number of lanes
router.post('/lanes', competitionController.setNumLanes);

// PUT /api/competition/lanes - Update number of lanes
router.put('/lanes', competitionController.updateNumLanes);

module.exports = router;
