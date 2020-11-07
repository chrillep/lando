'use strict';

// Modules
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/*
 * Helper to load all the lagoon config files we can find
 */
exports.loadConfigFiles = baseDir => {
  // Get the lagoon file
  const lagoonFile = path.join(baseDir, '.lagoon.yml');
  const lagoonConfig = yaml.safeLoad(fs.readFileSync(lagoonFile));
  // Use that to get the docker-compose file
  const composeFile = path.join(baseDir, lagoonConfig['docker-compose-yaml']);
  const composeConfig = yaml.safeLoad(fs.readFileSync(composeFile));

  // Return this raw config
  return {
    compose: composeConfig,
    lagoon: lagoonConfig,
  };
};

/*
 * Helper to parse the lagoon docker-compose file
 */
exports.parseServices = (services, recipeConfig) => _(services)
  // Remove unneeded things from the docker config and determine the type of the service
  .map((config, name) => _.merge({}, {
    name,
    type: _.get(config.labels, 'lando.type'),
    compose: _.omit(config, ['volumes', 'volumes_from', 'networks', 'user']),
    config: recipeConfig,
  }))
  // Return
  .value();
