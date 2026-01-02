const Paste = require('../models/Paste');
const mongoose = require('mongoose');


const getNow = (req) => {
  if (process.env.TEST_MODE === '1' && req.headers['x-test-now-ms']) {
    return new Date(Number(req.headers['x-test-now-ms']));
  }
  return new Date();
};

exports.createPaste = async (req, res) => {
  // accept either camelCase or snake_case from clients
  const content = req.body.content;
  const ttlSeconds = typeof req.body.ttlSeconds !== 'undefined' ? req.body.ttlSeconds : req.body.ttl_seconds;
  const maxViews = typeof req.body.maxViews !== 'undefined' ? req.body.maxViews : req.body.max_views;

  if (typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Invalid content' });
  }

  let expiresAt = null;
  if (typeof ttlSeconds !== 'undefined') {
    const ttl = Number(ttlSeconds);
    if (!Number.isInteger(ttl) || ttl <= 1) {
      return res.status(400).json({ error: 'ttl_seconds must be an integer > 1' });
    }
    expiresAt = new Date(Date.now() + ttl * 1000);
  }

  let mv = null;
  if (typeof maxViews !== 'undefined') {
    const m = Number(maxViews);
    if (!Number.isInteger(m) || m <= 1) {
      return res.status(400).json({ error: 'max_views must be an integer > 1' });
    }
    mv = m;
  }

  const paste = await Paste.create({
    content: content,
    expiresAt,
    maxViews: mv
  });

  res.status(201).json({ id: paste._id.toString(), url: `${req.protocol}://${req.get('host')}/p/${paste._id}` });
};

exports.getPaste = async (req, res) => {
  const paste = await Paste.findById(req.params.id);
  if (!paste) return res.status(404).json({ error: 'Not found' });

  const current = getNow(req);
  if ((paste.expiresAt && current > paste.expiresAt) ||
      (paste.maxViews !== null && paste.views >= paste.maxViews)) {
    return res.status(404).json({ error: 'Unavailable' });
  }

  paste.views += 1;
  await paste.save();

  res.json({
    content: paste.content,
    remainingViews: paste.maxViews ? paste.maxViews - paste.views : null,
    expiresAt: paste.expiresAt
  });
};

exports.healthCheck = async (req, res) => {
  const pingDb = () => {
      if (!mongoose.connection.db) return Promise.reject(new Error('no-db'));
      return mongoose.connection.db.admin().ping();
    };
  
    // respond quickly if DB doesn't reply within timeout
    const timeoutMs = 500;
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs));
  
    try {
      await Promise.race([pingDb(), timeout]);
      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(500).json({ ok: false });
    }
}
