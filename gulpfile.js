'use strict';
var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-minify-css'),
	rimraf = require('rimraf'),
	browserSync = require('browser-sync'),
	imagemin = require('gulp-imagemin'),
	plumber = require('gulp-plumber'),
	imageResize = require('gulp-image-resize'),
	replace = require('gulp-replace'),
	reload = browserSync.reload;

var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/'
	},
	src: {
		html: 'src/*.html',
		js: 'src/js/*.js',
		style: 'src/style/*.scss',
		img: 'src/img/**/*'
	},
	watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.scss'
	},
	clean: './build'
};


gulp.task('webserver', function(){
	browserSync({
		server: {
			baseDir:"./build"
		},
		host: "localhost",
		port: 3000,
		tunnel: true
	});
});

gulp.task('html:build',function(){
	var now = new Date().getTime();
	gulp.src(path.src.html)
	.pipe(plumber())
	.pipe(replace('--head--','html-head.html'))
	.pipe(replace('--path--',''))
	.pipe(replace('--version--','v='+now))
	.pipe(rigger())

	.pipe(gulp.dest(path.build.html))
	.pipe(reload({stream: true}));
});

gulp.task('img:build',function(){
	gulp.src(path.src.img)
	.pipe(plumber())
	.pipe(gulp.dest(path.build.img))
	.pipe(reload({stream: true}));
});

gulp.task('js:build',function(){
	gulp.src(path.src.js)
	.pipe(plumber())
	.pipe(rigger())
	.pipe(sourcemaps.init())
	.pipe(gulp.dest(path.build.js))
	.pipe(reload({stream:true}));
});

gulp.task('style:build', function(){
	gulp.src(path.src.style)
	.pipe(plumber())
	.pipe(sourcemaps.init())
	.pipe(sass())
	.pipe(prefixer())
	.pipe(gulp.dest(path.build.css))
	.pipe(reload({stream:true}));
});

gulp.task('imagemin', function() {
  gulp.src(path.src.img)
  .pipe(imagemin())
  .pipe(gulp.dest(path.build.img))
});
gulp.task('build', [
	'html:build',
	'js:build',
	'style:build',
	'img:build'
]);

gulp.task('watch', function(){
	watch([path.watch.js], function(ev, callback) {
		gulp.start('js:build');
	});
	watch([path.watch.html], function(ev, callback) {
		gulp.start('html:build');
	});
	watch([path.watch.style], function(ev, callback) {
		gulp.start('style:build');
	});
	watch([path.watch.style], function(ev, callback) {
		gulp.start('img:build');
	});
});


gulp.task('clean', function(callback){
	rimraf(path.clean, callback);
});

gulp.task('default', ['build', 'webserver', 'watch']);