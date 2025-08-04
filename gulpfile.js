// Require our modules
const gulp = require( "gulp" );
const concat = require( "gulp-concat" );
const uglify = require( "gulp-uglify" );
const minify = require( "gulp-minify" );


gulp.task( 'scripts', function() {
    return gulp.src( ["./public/js/dashboard.js"] )
        .pipe( concat( 'all.js' ) )
        .pipe( uglify() )
        .pipe( gulp.dest( './public/js/' ) )
} );


