const Paste = require('../models/Paste');

const getNow = (req) => {
  if (process.env.TEST_MODE === '1' && req.headers['x-test-now-ms']) {
    return new Date(Number(req.headers['x-test-now-ms']));
  }
  return new Date();
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
