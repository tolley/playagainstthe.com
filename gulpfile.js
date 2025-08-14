// Require our modules
const gulp = require( "gulp" );
const concat = require( "gulp-concat" );
const uglify = require( "gulp-uglify" );
const minify = require( "gulp-minify" );

// Make lists of JS files and where to save the minified version
var publicJSFiles = [
    "./public/js/jquery.js",
    "./public/js/methods.js",
    "./public/js/main.js",
    "./public/js/dashboard_views/create_game.js"
];

var dashboardJSFiles = [
    "./public/js/game_components/tictactoe/index.js",
    "./public/js/game_components/checkers/checkerboard.js",
    "./public/js/game_components/checkers/index.js",
    "./public/js/dashboard_views/home.js",
    "./public/js/dashboard_views/game.js",
    "./public/js/dashboard_views/play.js",
    "./public/js/game.js",
    "./public/js/play.js",
    "./public/js/dashboard_views/index.js",
    "./public/js/dashboard.js"
];


gulp.task( 'pub_scripts', function() {
    return gulp.src( publicJSFiles )
        .pipe( concat( 'all_public.js' ) )
        .pipe( uglify() )
        .pipe( gulp.dest( './public/js/' ) )
} );

gulp.task( 'dash_scripts', function() {
    return gulp.src( dashboardJSFiles )
        .pipe( concat( 'all_dashboard.js' ) )
        .pipe( uglify() )
        .pipe( gulp.dest( './public/js/' ) )
} );


