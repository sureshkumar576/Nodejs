const Job = require('../models/jobModel');
const jwt = require('jsonwebtoken');

function verifyUser(req) {
  const header = req.headers.authorization;
  if (!header) return null;
  const token = header.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

exports.createJob = async (req, res) => {
  const decoded = verifyUser(req);
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { company, role, status, deadline, notes } = req.body;
    const job = await Job.create({
      company, role, status, deadline, notes, user: decoded.id
    });
    res.status(201).json({ message: 'Job created', job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  const decoded = verifyUser(req);
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const jobs = await Job.find({ user: decoded.id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  const decoded = verifyUser(req);
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: decoded.id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job updated', job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  const decoded = verifyUser(req);
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: decoded.id });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
