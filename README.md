# hexo-generator-amp

AMP ⚡ HTML (Accelerated Mobile Pages Project HTML) generator for [Hexo](https://github.com/hexojs/hexo).

DEMO:　[HTML](https://photo-tea.com/p/hexo-markdown-notation/) | [AMP HTML](https://photo-tea.com/p/hexo-markdown-notation/amp/#development=1)

![Screenshot](src/img/hexo2amp.png)

## Orverview

You able to generate an AMP site with almost little effort.

- Automatically generates new [AMP HTML](https://www.ampproject.org/docs/get_started/about-amp.html) pages
- [Freely customize AMP HTML template](https://github.com/tea3/hexo-generator-amp/wiki/More-Settings#to-customize-template)
- [Automatically validate AMP HTML pages](https://github.com/tea3/hexo-generator-amp/wiki/More-Settings#7-automatically-validate-amp-html-option)
- [Improve generation speed (Cache mode)](https://github.com/tea3/hexo-generator-amp/wiki/More-Settings#6-cache-option)
- [Supports external services](https://github.com/tea3/hexo-generator-amp/wiki/More-Settings#supports-external-services)



## Installation

``` bash
$ npm install hexo-generator-amp --save
```

If you occur `ERROR Plugin load failed:` error or `DTraceProviderBindings.node` error , please see below.

- [ISSUE_TEMPLATE](https://github.com/tea3/hexo-generator-amp/blob/master/.github/ISSUE_TEMPLATE.md)
- [DTraceProviderBindings.node issue #1 (hexo-related-popular-posts)](https://github.com/tea3/hexo-related-popular-posts/issues/1)

To publish AMP HTML, please refer to the following simple procedure.

### 1. Edit your theme

You must add AMP HTML's link to non-AMP.

> Accelerated Mobile Pages Project - [Prepare Your Page for Discovery and Distribution](https://www.ampproject.org/docs/get_started/create/prepare_for_discovery)

First, add the following in your template files. For example , Please edit `themes/(your-theme)/layout/_partial/head.ejs` as following .  For example , in [hexo-theme-landscape](https://github.com/hexojs/hexo-theme-landscape) you will edit `themes/landscape/layout/_partial/head.ejs`.

``` ejs
<% if (is_post() && config.generator_amp){ %>
        <link rel="amphtml" href="<%= config.url %><%= config.root %>amp/<%= page.path %>">
<% } %>
```

Please refer follow as about how to use this plugin with based other templates.

- [Jade template](https://github.com/tea3/hexo-generator-amp/issues/13)
- [Swig template (e.g. hexo-theme-next)](https://github.com/tea3/hexo-generator-amp/issues/14)


### 2. Set the quick option

Please set the following options. Please edit `_config.yml`.

``` yaml
# hexo-generator-amp
# The following settings is the quick start options.

generator_amp:
  templateDir:  amp-template
  assetDistDir: amp-dist
  logo:
    path:   sample/sample-logo.png
    width:  600
    height: 60
  substituteTitleImage:
    path:   sample/sample-substituteTitleImage.png
    width:  1024
    height: 800
  warningLog: false   # To display warning, please set true.
```

To set the detail option , please see [wiki](https://github.com/tea3/hexo-generator-amp/wiki/More-Settings#options).

### 3. Run server

Starts a local server. By default, this is at `http://localhost:4000/`.

``` bash
$ hexo clean
$ hexo server
```

This plugin generated the AMP HTML. Please open `http://localhost:4000/your-posts-parmalink/amp/` in browser.

If occured plugin error , Please refer [#17](https://github.com/tea3/hexo-generator-amp/issues/17) and [other issue](https://github.com/tea3/hexo-generator-amp/issues?q=is%3Aissue+is%3Aclosed) .

### 4. Validate AMP HTML

This plugin generated the AMP HTML. Output file path is `./your-posts-parmalink/amp/`. Next , you should validate AMP HTML with the following procedure.

1. Please open your AMP HTML page in [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/).
2. The Chrome DevTools console can check for AMP HTML. please Append `http://localhost:4000/your-posts-parmalink/amp/#development=1` to the URL. Please see below for the details.

> Accelerated Mobile Pages Project - [Validate AMP Pages](https://www.ampproject.org/docs/guides/validate.html)

> How to validate AMP - [my blog](https://photo-tea.com/p/how-to-validate-amp/) (Japanese)


To validate automatically from commandline , please see [wiki - Automatically Validate AMP HTML option](https://github.com/tea3/hexo-generator-amp/wiki/More-Settings#7-automatically-validate-amp-html-option).

### 5. Deploy

If no AMP HTML Validation error is displayed , verification is complete . Please deploy at the end.

``` bash
$ hexo clean
$ hexo server
$ hexo generate
$ hexo deploy -g
```

When the deployment is completed , Please check the [AMP report](https://support.google.com/webmasters/answer/6328309?hl=en)


## Wiki

Please see the [wiki](https://github.com/tea3/hexo-generator-amp/wiki/More-Settings) for detailed usage.


## License

MIT

[Hexo]: http://hexo.io/