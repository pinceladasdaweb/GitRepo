# GitRepo
> GitHub Repo Widget developed with VanillaJS.

## Motivation
I created a version of [Vanilla JS](http://vanilla-js.com/) based on the original of [JoelSutherland](https://github.com/JoelSutherland/GitHub-jQuery-Repo-Widget).

# How to install
You can download the lib:

* [development version](lib/gitrepo.js)
* [minified version](build/gitrepo.min.js)

Please, this lib don't have CDN yet, so you need to download and put it in your own site.

# How to use
### Loading the lib

Like I said, download the package and reference the JavaScript and CSS files manually, using this tag below:

```html
<!-- Required CSS for the GitRepo lib -->
<link href="/path/to/gitrepo.min.css" rel="stylesheet" type="text/css" media="all">
<!-- Loading and initialize the GitRepo lib -->
<script src="/path/to/gitrepo.min.js"></script>
<script>GitRepo.init();</script>
```

Everwhere you want a widget to be placed, add the following markup:

```html
<div class="github-widget" data-repo="pinceladasdaweb/GitRepo"></div>
```

# Rate Limiting
The rate limit allows you to make up to [60 requests per hour](https://developer.github.com/v3/#rate-limiting)

# Compatibility

![IE](https://cloud.githubusercontent.com/assets/398893/3528325/20373e76-078e-11e4-8e3a-1cb86cf506f0.png) | ![Chrome](https://cloud.githubusercontent.com/assets/398893/3528328/23bc7bc4-078e-11e4-8752-ba2809bf5cce.png) | ![Firefox](https://cloud.githubusercontent.com/assets/398893/3528329/26283ab0-078e-11e4-84d4-db2cf1009953.png) | ![Opera](https://cloud.githubusercontent.com/assets/398893/3528330/27ec9fa8-078e-11e4-95cb-709fd11dac16.png) | ![Safari](https://cloud.githubusercontent.com/assets/398893/3528331/29df8618-078e-11e4-8e3e-ed8ac738693f.png)
--- | --- | --- | --- | --- |
IE 8+ ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

## License
GitRepo is licensed under the MIT License.