'use strict';

var assign      = require('object-assign');
var pathFn      = require('path');
var gen         = require('./lib/generator');
var ic          = require('./lib/copyAssets.js');
var lg          = require('./lib/log.js');
var su          = require('./lib/settingsUpdate.js');
var cache       = require('./lib/cache.js');
var isEnableAMP = true;

lg.setConfig(hexo.config);
ic.setConfig(hexo.config);


if(hexo.config.generator_amp && hexo.config.generator_amp.onlyForDeploy){
	lg.log("info", "'onlyForDeploy' option deprecated. Please set the 'cache' option." , null);
}

//default path
var ejsPath         = '../template/sample-amp.ejs';
var cssPath         = '../template/sample-amp.css';
var logoPath        = '../template/sample-logo.png';
var sitelogoPath    = '../template/sample-yoursite-logo.png';
var avatarPath      = '../template/sample-avator.png';
var placeholderPath = '../template/sample-placeholder.png';
var substituteTitleImagePath    = '../template/sample-substituteTitleImage.png';

//------------------------------------
// copy template file
//------------------------------------
if(hexo.config.generator_amp && hexo.config.generator_amp.templateDir && hexo.config.generator_amp.assetDistDir && hexo.config.generator_amp.logo && hexo.config.generator_amp.logo.path && hexo.config.generator_amp.substituteTitleImage && hexo.config.generator_amp.substituteTitleImage.path){
	ic.initCopy( pathFn.join(hexo.config.generator_amp.templateDir) , [ejsPath, cssPath, logoPath, sitelogoPath, substituteTitleImagePath, avatarPath , placeholderPath]);
}else{
	lg.log("error", "Please set the generator_amp option." , "_config.yml");
	return null;
}

hexo.config.generator_amp = assign({
	
}, hexo.config.generator_amp, {
	"defaultAssetsPath" : {
		"tmpl" : ejsPath ,
		"css" : cssPath ,
		"logo": logoPath ,
		"avator" : avatarPath ,
		"placeholder": placeholderPath ,
		"substituteTitleImage" : substituteTitleImagePath
	}
});

var shush     = su.chkUpdate(hexo.config);
var cacheHash = cache.getCacheHash(hexo.config);

hexo.config.generator_amp = assign({},
	hexo.config.generator_amp, {
		"hash" : shush ,
		"isCacheUpdate": (shush != cacheHash),
		"isCacheClear": (shush != cacheHash)
	}
);

hexo.extend.generator.register('amp', module.exports = function(locals) {
	return gen( locals , hexo );
});
hexo.extend.filter.register('after_post_render', require('./lib/eyeCatchVars') );
