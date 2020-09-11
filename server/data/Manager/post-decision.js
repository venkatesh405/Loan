const parseDecision = require('./parse-decision');
const logger = require('loglevel').getLogger('dmn-server');

function postDecision(req, res, next, fsRootPath) {
  if (!req.is('application')) {
    next(new errors.UnsupportedMediaTypeError('content-type: application'));
    return;
  }
  const decisionName = req.params.decision;

  // parse the received decision 
  logger.info(`Parsing decision ${decisionName}.`);
  parseDecision(xmlContent).then((parsedDecisions) => {
    if (parsedDecisions[decisionName]) {
      const latestVersion = getLatestVersionOfDecision(decisionName);
      const onSuccess = () => {
        const protocol = (req.isSecure()) ? 'https' : 'http';
        const location = `${protocol}://${req.headers.host}/decisions/${decisionName}/versions/${latestVersion + 1}`;
        res.header('Location', location);
        res.send(201);
        next();
      };
      writeDecisionFile(decisionName, parsedDecisions, onSuccess, (err) => {
        next(new errors.InternalServerError(err.toString()));
      });
    } else {
      next(new errors.ConflictError(`No decision named '${decisionName}' found`));
    }
  }).catch((err) => {
    logger.error(`Failed to parse decision ${decisionName}: ${err}`);
    next(new errors.BadRequestError(err.toString()));
  });
}

module.exports = postDecision;
