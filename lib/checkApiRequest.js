'use strict';

function isApiRequest(url) {
  return !!/^\/api/.exec(url);
}

module.exports = isApiRequest;