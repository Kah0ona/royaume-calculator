// -------------------------------------
// Grunt copy
// -------------------------------------

module.exports = function (grunt) {

  return {
    // ----- Copy code files ----- //
    all: {
      files: [
	  
	  {
        cwd: '.',
        src: ['plugin.php', 'model.js','view.js','controller.js', '*.css'],
        dest: 'dist/',
        expand: true
      }, {
        cwd: 'css/',
        src: '*.css',
        dest: 'dist/css',
        expand: true
      },{
        cwd: 'js/',
        src: '*.js',
        dest: 'dist/js',
        expand: true
      }]
    }
  }
}; 
