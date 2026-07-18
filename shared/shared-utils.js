(function (window, document) {
  'use strict';

  var shared = window.ApprenticePlusShared = window.ApprenticePlusShared || {};

  function emit(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-applus-src="' + src + '"]');
      if (existing) {
        resolve(existing);
        return;
      }
      var script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.dataset.applusSrc = src;
      script.onload = function () { resolve(script); };
      script.onerror = function () { reject(new Error('Unable to load ' + src)); };
      document.head.appendChild(script);
    });
  }

  function loadStyle(href) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('link[data-applus-href="' + href + '"]');
      if (existing) {
        resolve(existing);
        return;
      }
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.applusHref = href;
      link.onload = function () { resolve(link); };
      link.onerror = function () { reject(new Error('Unable to load ' + href)); };
      document.head.appendChild(link);
    });
  }

  shared.utils = Object.freeze({
    emit: emit,
    loadScript: loadScript,
    loadStyle: loadStyle,
    ready: function (callback) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
      } else {
        callback();
      }
    }
  });
})(window, document);
