'use strict';

const fs             = require('fs');
const pathFn         = require('path');
var Promise          = require('bluebird');
var cheerio          = require('cheerio');
var tp               = require('./templatePath.js');


// Filtering function for AMP generation
var af_cc = require("./filter/check-cache.js");
var af_fe = require("./filter/figure-escape.js");
var af_ga = require("./filter/google-adsense.js");
var af_vc = require("./filter/valuecommerce.js");
var af_ta = require("./filter/table-align.js");
var af_fr = require("./filter/figure-restoration.js");
var af_im = require("./filter/img.js");
var af_yt = require("./filter/youtube.js");
var af_vm = require("./filter/vimeo.js");
var af_yv = require("./filter/lazy-youtube-vimeo.js");
var af_tw = require("./filter/twitter.js");
var af_ig = require("./filter/instagram.js");
var af_oi = require("./filter/other-iframe.js");
var af_vd = require("./filter/video.js");
var af_sn = require("./filter/sanitize.js");
var af_rd = require("./filter/rendering-html.js");
var af_mn = require("./filter/minify-html.js");
var af_ch = require("./filter/write-cache.js");
var af_av = require("./filter/amp-validate.js");
var af_sc = require("./filter/soundcloud.js");
var af_fm = require("./filter/formula.js")

const absolutePathReg = /^[a-zA-Z0-9]*?\:\/\//;


module.exports = function(locals , hexo ) {
    var config = hexo.config;
    var env = hexo.env;
    var pobj = tp.getPath(config);
    
    return Promise.all( locals.posts.map(function(post){
      
      var tempData = {
        isCacheUse              : false ,
        template                : pobj.template ,
        cssTxt                  : pobj.cssTxt ,
        avatarPath_template     : pobj.avatarPath_template ,
        placeholder_template    : pobj.placeholder_template ,
        logoPath_template       : pobj.logoPath_template ,
        logoPath_for_amp        : pobj.logoPath_for_amp ,
        logoPath_template_width : pobj.logoPath_template_width ,
        logoPath_template_height: pobj.logoPath_template_height ,
        idDecorator             : 0 ,
        totalPosts              : locals.posts.length ,
        posts                   : locals.posts ,
        figureEscArr            : [],
        isYoutubeContain        : false ,
        isVimeoContain          : false ,
        isVideoContain          : false ,
        isInstagramContain      : false ,
        isTwitterContain        : false ,
        isSoundCloudContain     : false ,
        isIframeContain         : false ,
        isElseAdContain         : false ,
        isFormulaContain        : false
      };
      
      return {
        data     : "<html>AMP HTML</html>" ,
        post     : post ,
        config   : config ,
        tempData : tempData,
        env      : env
      }
    }))
    .then(localPostsProcess)
    .then(finish_return)
    .then(routes => appendAssetsRoutes(routes, config));
};


// Processing upon completion
function finish_return(results){
  // console.log(( (results[0].config.generator_amp.warningLog && results[0].config.generator_amp.html_minifier && typeof results[0].config.generator_amp.html_minifier === "object" ) ? "\r" : ""));
  var returnData = [];
  for(var i = 0; i < results.length; i++){
      returnData.push({
        path : results[i].path ,
        data : results[i].data
      });
  }
  
  // return results;
  return returnData;
}

/**
 * Append asset files' routes to the given routes.
 * @param {Array<{path: string, data: *}>} routes The original routes
 * @param {*} config The `hexo.config` object
 */
function appendAssetsRoutes(routes, config) {
  const { templateDir, assetDistDir } = config.generator_amp;

  let avatorDefaultPath = pathFn.join("sample", "sample-avator.png");
  if (config.authorDetail && config.authorDetail.avatar && config.authorDetail.avatar.path) {
    avatorDefaultPath = config.authorDetail.avatar.path;
  }
  
  let placeholderDefaultPath = "sample/" + pathFn.join("sample", "sample-placeholder.png");
  if (config.generator_amp.placeholderImg && config.generator_amp.placeholderImg.path) {
    placeholderDefaultPath = config.generator_amp.placeholderImg.path;
  }
  
  let siteLogImagePath = "";
  if (config.generator_amp.logo_topImage && config.generator_amp.logo_topImage.path) {
    siteLogImagePath = config.generator_amp.logo_topImage.path;
  } else {
    siteLogImagePath = config.generator_amp.logo.path;
  }

  const assets = [
    config.generator_amp.logo.path,
    config.generator_amp.substituteTitleImage.path,
    avatorDefaultPath,
    siteLogImagePath,
    placeholderDefaultPath,
  ];
  const assetsRoutes = [];
  assets.forEach((asset) => {
    if (absolutePathReg.test(asset)) {
      // External path
      return;
    }
    const assetPath = pathFn.join(templateDir, asset);
    if (!fs.existsSync(assetPath)) {
      throw new Error("Not found the hexo-generator-amp's asset files: "
        + assetPath + ". "
        + "If you do not have the file please download the sample file from "
        + "the following site. ( see: "
        + "https://github.com/tea3/hexo-generator-amp/tree/master/template )");
    }
    // Valid asset file
    assetsRoutes.push({
      path: `${assetDistDir}/${asset}`,
      data: () => fs.createReadStream(assetPath),
    });
  });
  return routes.concat(assetsRoutes);
}

// Processing on local.posts
function localPostsProcess(results){
  return new Promise.all( results.map(postProcess));
}


// Processing on post
function postProcess(result){
  return af_cc.checkCache(result)
    .then(af_fe.filter_figureEscape)
    .then(af_ga.filter_googleAdsense)
    .then(af_vc.filter_valuecommerce)
    .then(af_ta.filter_tablesAlign)
    .then(af_fr.filter_figureRestoration)
    .then(af_im.filter_img)
    .then(af_yt.filter_youtube)
    .then(af_vm.filter_vimeo)
    .then(af_yv.filter_lazyYoutubeAndVimeo)
    .then(af_tw.filter_twitter)
    .then(af_ig.filter_instagram)
    .then(af_sc.filter_soundcloud)
    .then(af_oi.filter_otherIframe)
    .then(af_vd.filter_video)
    .then(af_sn.filter_sanitize)
    .then(af_fm.filter_formula)
    .then(af_rd.rendering_html)
    .then(af_mn.html_minify)
    .then(af_ch.write_cache)
    .then(af_av.amp_validate)
}