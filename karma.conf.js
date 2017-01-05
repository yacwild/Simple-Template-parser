module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    reporters: ['spec'],
    browsers: ['PhantomJS'],
    files: [
      'deploy/template.js',      
      'tests/*.test.js'
    ]
  });
};