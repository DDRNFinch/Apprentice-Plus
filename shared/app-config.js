(function (window) {
  'use strict';

  var shared = window.ApprenticePlusShared = window.ApprenticePlusShared || {};
  var pathname = String(window.location.pathname || '').toLowerCase();
  var courseMatch = pathname.match(/\/courses\/([^/]+)(?:\/|$)/);
  var courseId = courseMatch ? courseMatch[1] : 'main';

  var courseNames = {
    bench: 'Bench Joinery',
    brick: 'Bricklaying',
    site: 'Site Carpentry',
    pmo: 'Property Maintenance Operative',
    main: 'Apprenticeship+'
  };

  shared.config = Object.freeze({
    version: '1.0.0-phase1',
    courseId: courseId,
    courseName: courseNames[courseId] || courseId,
    isCoursePage: courseId !== 'main',
    sharedRoot: shared.sharedRoot || '../../shared/',
    enabledModules: []
  });
})(window);
