const debug = require('debug')('app:error');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  debug(err.stack);
  const message = err.isJoi
    ? err.details.map((x) => x.message + '.').join('\n')
    : err.message;

  if (req.xhr || !req.accepts('html') || req.path.startsWith('/api/')) {
    res.status(500).json({ error: message });
  } else {
    res.status(500).render('error', { title: 'Error', message });
  }
};
