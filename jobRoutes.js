const express = require('express');
const router = express.Router();
const jobs = require('../controllers/jobController');

router.post('/', jobs.createJob);
router.get('/', jobs.getJobs);
router.put('/:id', jobs.updateJob);
router.delete('/:id', jobs.deleteJob);

module.exports = router;
