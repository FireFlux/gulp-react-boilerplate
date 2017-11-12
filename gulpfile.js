//----------------------------------------------------------------------------------------------------------------------
// region IMPORTS / VARS
//----------------------------------------------------------------------------------------------------------------------
let gulp = require('gulp'),
    webpack = require('webpack');

// Gulp Plugins
let autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect'),
    gulpHandlebars = require('gulp-compile-handlebars'),
    gulpWebpack = require('gulp-webpack'),
    gutil = require('gulp-util'),
    inject = require('gulp-inject'),
    open = require('gulp-open'),
    path = require('path'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch');

// Webpack Plugins
let CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin'),
    DefinePlugin = webpack.DefinePlugin,
    ProvidePlugin = webpack.ProvidePlugin,
    UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    webpackMerge = require('webpack-merge');

// Variables and Constants
const PATH_SRC = 'src/',
    PATH_DEV = 'dev/',
    PATH_DIST = 'dist/';

let connectServerOptions = {
    root: '',
    host: 'localhost',
    port: 8081,
    name: 'dev server'
};

// endregion
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// region WEBPACK CONFIG
//----------------------------------------------------------------------------------------------------------------------
let webpackConfigCommon = {
    entry: {
        app: path.resolve(__dirname, PATH_SRC + 'js/index.js'),
        'vendor/vendor': [
            'babel-polyfill',
            'lodash',
            'react',
            'react-dom',
            'redux',
            'react-redux',
            'redux-thunk',
            'axios',
            'redux-logger'
        ]
    },
    output: {
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].bundle.map'
    },
    resolve: {
        modules: [
            path.resolve(__dirname, PATH_SRC + 'js/'),
            'node_modules'
        ],
        alias: {
            config: path.resolve(__dirname, PATH_SRC + 'js/shared/config.js'),
            util: path.resolve(__dirname, PATH_SRC + 'js/shared/util.js')
        }
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                        },
                    },
                ],
            }
        ]
    },
    plugins: [
        new CommonsChunkPlugin({
            name: ['vendor/vendor'],
            minChunks: Infinity
        }),
        new ProvidePlugin({
            _: 'lodash'
        })
    ]
};

let webpackConfigDev = {
    watch: true,
    devtool: 'source-map'
};

let webpackConfigDist = {
    devtool: 'source-map',
    plugins: [
        new DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new UglifyJSPlugin({
            sourceMap: true,
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        })
    ]
};

// endregion
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// region TASKS
//----------------------------------------------------------------------------------------------------------------------
gulp.task('default', ['initial-sequence:dev', 'css:watch:dev', 'js:watch:dev', 'template:watch']);

gulp.task('deploy', ['css:build:dist', 'js:build:dist']);

gulp.task('initial-sequence:dev', function (done) {
    sequence(['css:clean-and-build:dev', 'js:clean-and-build:dev'], 'template:compile', 'connect:start', done);
});

// endregion
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// region CSS
//----------------------------------------------------------------------------------------------------------------------
gulp.task('css:clean:dev', function () {
    return gulp.src(PATH_DEV + 'css/*', {read: false})
        .pipe(clean());
});

gulp.task('css:build:dev', function () {
    return gulp.src(PATH_SRC + 'scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(PATH_DEV + 'css'));
});

gulp.task('css:clean-and-build:dev', function (done) {
    sequence('css:clean:dev', 'css:build:dev', done);
});

gulp.task('css:watch:dev', function () {
    return watch(PATH_SRC + 'scss/**/*.scss', {read: false}, function (file) {
        //gutil.log(file.event);
        //if(file.event === 'add' || file.event === 'unlink')
        if (file.event === 'unlink')
        {
            sequence('css:clean:dev', 'css:build:dev');
        } else
        {
            gulp.start('css:build:dev');
        }
    });
});

gulp.task('css:clean:dist', function () {
    return gulp.src(PATH_DIST + 'css/*', {read: false})
        .pipe(clean());
});

gulp.task('css:build:dist', ['css:clean:dist'], function () {
    return gulp.src(PATH_SRC + 'scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(PATH_DIST + 'css'));
});

// endregion
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// region JS
//----------------------------------------------------------------------------------------------------------------------
gulp.task('js:build:dev', function () {
    let config = webpackMerge(webpackConfigCommon, webpackConfigDev);

    config = webpackMerge(config, {watch: false});

    return gulp.src(PATH_SRC + 'js/index.js')
        .pipe(gulpWebpack(config, webpack))
        .pipe(gulp.dest(PATH_DEV + 'js/'));
});

gulp.task('js:watch:dev', function () {
    return gulp.src(PATH_SRC + 'js/index.js')
        .pipe(gulpWebpack(webpackMerge(webpackConfigCommon, webpackConfigDev), webpack))
        .pipe(gulp.dest(PATH_DEV + 'js/'));
});

gulp.task('js:clean-and-build:dev', function (done) {
    sequence('js:clean:dev', 'js:build:dev', done);
});

gulp.task('js:clean:dev', function () {
    return gulp.src(PATH_DEV + 'js/*', {read: false})
        .pipe(clean());
});

gulp.task('js:build:dist', ['js:clean:dist'], function () {
    return gulp.src(PATH_SRC + 'js/index.js')
        .pipe(gulpWebpack(webpackMerge(webpackConfigCommon, webpackConfigDist), webpack))
        .pipe(gulp.dest(PATH_DIST + 'js/'));
});

gulp.task('js:clean:dist', function () {
    return gulp.src(PATH_DIST + 'js/*', {read: false})
        .pipe(clean());
});

// endregion
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// region OTHER
//----------------------------------------------------------------------------------------------------------------------
gulp.task('connect:start', function () {
    connect.server(connectServerOptions);

    gulp.src('')
        .pipe(open({
            uri: 'http://' + connectServerOptions.host + ':' + connectServerOptions.port + '/index.html'
        }));
});

gulp.task('template:compile', function () {
    let cssStream = gulp.src(PATH_DEV + 'css/**/*.css', {read: false}),
        vendorStream = gulp.src(PATH_DEV + 'js/vendor/**/*.js', {read: false}),
        appStream = gulp.src([PATH_DEV + 'js/**/*.js', '!' + PATH_DEV + 'js/vendor/**/*.js'], {read: false}),
        handlebarsTemplateData = {},
        handlebarsOtions = {
            ignorePartials: true
        };

    return gulp.src(PATH_SRC + 'template/index.hbs')
        .pipe(gulpHandlebars(handlebarsTemplateData, handlebarsOtions))
        .pipe(rename('index.html'))
        .pipe(inject(cssStream, {
            starttag: '<!-- inject:css -->',
            addRootSlash: false
        }))
        .pipe(inject(vendorStream, {
            starttag: '<!-- inject:vendor -->',
            addRootSlash: false
        }))
        .pipe(inject(appStream, {
            starttag: '<!-- inject:app -->',
            addRootSlash: false
        }))
        .pipe(gulp.dest(''));
});

gulp.task('template:watch', ['template:compile'], function (done) {
    return watch([PATH_SRC + 'template/**/*.hbs', PATH_DEV + 'css/**/*.css', PATH_DEV + 'js/**/*.js'], {read: false}, function (file) {
        gulp.start('template:compile');
    })
});

// endregion
//----------------------------------------------------------------------------------------------------------------------
