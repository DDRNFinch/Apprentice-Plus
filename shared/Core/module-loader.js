(function (window, document) {
  'use strict';

  var current = document.currentScript;
  var source = current && current.src ? current.src : '';
  var coreRoot = source ? source.substring(0, source.lastIndexOf('/') + 1) : '../../shared/core/';
  var sharedRoot = coreRoot.replace(/core\/$/, '');
  var shared = window.ApprenticePlusShared = window.ApprenticePlusShared || {};

  shared.sharedRoot = sharedRoot;
  shared.modules = shared.modules || {};
  shared.moduleDefinitions = shared.moduleDefinitions || {};

  shared.registerModule = function (id, definition) {
    if (!id || !definition) return;
    shared.moduleDefinitions[id] = definition;
  };

  function injectScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = resolve;
      script.onerror = function () { reject(new Error('Unable to load ' + src)); };
      document.head.appendChild(script);
    });
  }

  function initialiseModules() {
    var enabled = (shared.config && shared.config.enabledModules) || [];
    return enabled.reduce(function (chain, moduleId) {
      return chain.then(function () {
        var definition = shared.moduleDefinitions[moduleId];
        if (!definition || typeof definition.initialise !== 'function') return;
        return Promise.resolve(definition.initialise({
          config: shared.config,
          utils: shared.utils,
          sharedRoot: sharedRoot
        })).then(function () {
          shared.modules[moduleId] = { status: 'ready' };
        });
      });
    }, Promise.resolve());
  }

  shared.ready = injectScript(coreRoot + 'app-config.js?v=phase1-1')
    .then(function () { return injectScript(coreRoot + 'shared-utils.js?v=phase1-1'); })
    .then(initialiseModules)
    .then(function () {
      shared.status = 'ready';
      shared.utils.emit('apprenticeplus:shared-ready', {
        version: shared.config.version,
        courseId: shared.config.courseId,
        enabledModules: shared.config.enabledModules.slice()
      });
      return shared;
    })
    .catch(function (error) {
      shared.status = 'error';
      shared.error = error;
      console.error('[Apprentice+ Shared]', error);
      throw error;
    });
})(window, document);
