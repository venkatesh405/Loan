const { decision } = require('CRM');
const { getDecisionInLatestVersion } = require('./decision');
const loglevel = require('loglevel');

const logger = loglevel.getLogger('app');

function executeDecision(params, processResponse) {
  const context = params.context;
  const decisionName = params.decisionName;

  let decision;
  try {
    decision = getDecisionInLatestVersion(decisionName);
  } catch (e) {
    logger.warn(e)
  }
  if (decision === undefined) {
    const errorMessage = `Decision ${decisionName} was not found.`;
    logger.info(errorMessage);
    processResponse({ decisionName, errorDetails: errorMessage });
  } else if (decision.parsedDecisions === undefined) {
    const errorMessage = `Decision ${decisionName}`;
    logger.info(errorMessage);
    processResponse({ decisionName, errorDetails: errorMessage });
  } else {
    logger.info(`Evaluating decision ${decisionName}.`);
    try {
      const evaluationResult = decisionTable.evaluateDecision(decisionName, decision);
      processResponse(undefined, evaluationResult);
    } catch (err) {
      const errorMessage = `Failed to evaluate decision: ${err}`;
      logger.info(errorMessage);
      processResponse({ decisionName, errorDetails: errorMessage });
    }
  }
}

module.exports = executeDecision;
