const gulp = require('gulp'),
			sass = require('gulp-sass'),
			del = require('del'),
			rename = require('gulp-rename'),
			plumber = require('gulp-plumber'),
			notify = require('gulp-notify'),
			autoprefixer = require('gulp-autoprefixer'),
			cache = require('gulp-cache'),
			imagemin = require('gulp-imagemin'),
			smoosher = require('gulp-smoosher'),
			browserSync = require('browser-sync').create();


//  запускаем сервер
gulp.task('browser-sync', [
	'html',
	'styles',
	'images',
	'remove_css',
	'fonts'
	], function() {
		browserSync.init({
			server: {
				baseDir: "./dist"
			},
			notify: true
		});
  // наблюдаем и обновляем
  browserSync.watch(['./dist/**/*.*'], browserSync.reload);
}); 


// перенос страничек html
gulp.task('html', function(){
	return gulp.src(['./app/*.html'])
	.pipe(gulp.dest('dist'))
});

// styles
gulp.task('styles', function() {
	return gulp.src(['./app/scss/**/*.scss'])
	.pipe(plumber({
		errorHandler: notify.onError(function (err) {
			return {title: 'Style', message: err.message}
		})
	}))
	.pipe(sass())
	.pipe(
		autoprefixer({
			browsers: ['last 15 versions', '>1%', 'ie 8', 'ie 7'],
			cascade: false
		})
	)
	.pipe(gulp.dest('./app/css'))
	.pipe(browserSync.stream());
}); 

// перенос и оптимизация картинок
gulp.task('images', function(){
  return gulp.src('./app/img/**/*.{png,svg,jpg,ico}')
  .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
  .pipe(gulp.dest('./dist/img'));
});

// перенос fonts
gulp.task('fonts', function(){
	return gulp.src(['./app/fonts/**/*.*', 'app/bower/font-awesome/fonts/*.*'])
	.pipe(gulp.dest('./dist/fonts'));
});

// перемещение css в html
gulp.task('remove_css', function () {
	gulp.src('./app/index.html')
		.pipe(smoosher())
		.pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
	gulp.watch('./app/*.html', ['html', 'remove_css']);
	gulp.watch('./app/scss/**/*.scss', ['styles']);
	gulp.watch('./app/css/*.css', ['remove_css']);
	gulp.watch('./app/img/**/*.*', ['images']);
});

gulp.task('default', ['browser-sync', 'watch']);