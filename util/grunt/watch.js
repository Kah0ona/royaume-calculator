// -------------------------------------
// Grunt watch
// -------------------------------------

module.exports = {

  // ----- Watch tasks ----- //
  all: {
    files: [
		'plugin.php',
		'*.js',
		'index.html',
		'css/*',
		'js/*'],
    tasks: [
      'copy:all',
    ]
  },
};
