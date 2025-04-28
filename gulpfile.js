import gulp from 'gulp';
import browserSync from 'browser-sync';
import cleanBuildFolder from './inc/clean.mjs';
import copyAssets from './inc/assets.mjs';
import processWebpack from './inc/webpack.mjs';
import {
  copyRasterGraphics,
  copyVectorGraphics,
  compileSprite,
} from './inc/images.mjs';

const {
  series,
  parallel,
  watch
} = gulp;

const BS_SERVER = browserSync.create();

const refreshServer = ( done ) => {
  BS_SERVER.reload();
  done();
};

const syncServer = () => {
  BS_SERVER.init( {
    server: {
      baseDir: '../assets/'
    },
    notify: false,
    ui: false,
  } );
  watch( './src/vendor/', series( processWebpack, refreshServer ) );
  watch( './src/assets/', series( copyAssets, refreshServer ) );
  watch( './src/style/**/*.scss', series( processWebpack, refreshServer ) );
  watch( './src/js/**/*.js', series( processWebpack, refreshServer ) );
  watch( [ './src/img/static/**.{jpg,jpeg,png,svg,gif,webp}' ], series( processWebpack, refreshServer ) );
  watch( [ './src/img/**/**.{jpg,jpeg,png,gif,webp}' ], series( copyRasterGraphics, refreshServer ) );
  watch( [ './src/img/**/**.svg', '!./src/img/sprite/**.svg' ], series( copyVectorGraphics, refreshServer ) );
  watch( './src/img/sprite/**.svg', series( compileSprite, refreshServer ) );
};

const processBuild = parallel(
  copyAssets,
  processWebpack,
  copyRasterGraphics,
  copyVectorGraphics,
  compileSprite,
);

const processDevelopment = series( cleanBuildFolder, processBuild, syncServer );
const runBuild = series( cleanBuildFolder, processBuild );

export default processDevelopment;
export {
  runBuild as build,
};