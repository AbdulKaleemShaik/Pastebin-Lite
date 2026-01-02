const Paste = require('../models/Paste');

const getNow = (req) => {
  if (process.env.TEST_MODE === '1' && req.headers['x-test-now-ms']) {
    return new Date(Number(req.headers['x-test-now-ms']));
  }
  return new Date();
};

exports.createPaste = async (req, res) => {
  const { content, ttlSeconds, maxViews } = req.body;
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'Invalid content' });
  }
  const paste = await Paste.create({
    content,
    expiresAt: ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : null,
    maxViews: typeof maxViews !== 'undefined' ? maxViews : null
  });
  res.json({ id: paste._id, url: `${req.protocol}://${req.get('host')}/p/${paste._id}` });
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

exports.renderPaste = async (req, res) => {
  const paste = await Paste.findById(req.params.id);
  if (!paste) return res.status(404).send('Not found');
  const current = getNow(req);
  if ((paste.expiresAt && current > paste.expiresAt) ||
      (paste.maxViews !== null && paste.views >= paste.maxViews)) {
    return res.status(404).send('Unavailable');
  }
  paste.views += 1;
  await paste.save();
  res.send(`<pre>${paste.content.replace(/</g,"&lt;")}</pre>`);
};
