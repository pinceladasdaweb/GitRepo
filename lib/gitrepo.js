/*jslint browser: true*/
/*global define, module, exports*/
(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.GitRepo = factory();
    }
}(this, function () {
    'use strict';

    if (!(Function.prototype.hasOwnProperty('bind'))) {
        Function.prototype.bind = function () {
            var fn = this, context = arguments[0], args = Array.prototype.slice.call(arguments, 1);
            return function () {
                return fn.apply(context, args.concat(Array.prototype.slice.call(arguments)));
            };
        };
    }

    var GitRepo = function () {
        if (!this || !(this instanceof GitRepo)) {
            return new GitRepo();
        }

        this.container = document.querySelectorAll('.github-widget');
        this.endpoint  = 'https://api.github.com/repos/';

        this.fetch();
    };

    GitRepo.prototype = {
        jsonp: function (url, callback, context) {
            var name = 'jsonp_' + Math.round(100000 * Math.random()),
                head, script, extScript;

            head           = document.head || document.getElementsByTagName('head')[0];
            extScript      = document.createElement('script');
            extScript.type = 'text/javascript';

            script       = extScript.cloneNode();
            script.src   = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + name;
            script.async = true;

            head.appendChild(script);

            window[name] = function (data) {
                callback.call((context || window), data);
                head.removeChild(script);
                script = null;
                delete this.name;
            }.bind(this);
        },
        each: function (els, callback) {
            var i = 0, max = els.length;
            while (i < max) {
                callback(els[i], i);
                i += 1;
            }
        },
        attach: function (res) {
            var pushed_at = 'unknown', url, date, els;

            if (res.pushed) {
                date      = new Date(res.pushed);
                pushed_at = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
            }

            url = (res.homepage !== null) ? res.homepage : '';

            els = [
                '<div class="github-box repo">',
                    '<div class="github-box-title">',
                        '<h3>',
                            '<a class="owner" href="' + res.vendorUrl + '" title="' + res.vendorUrl + '">' + res.vendor + '</a>',
                            '/',
                            '<a class="repo" href="' + res.repoUrl + '" title="' + res.repoUrl + '">' + res.name + '</a>',
                        '</h3>',
                        '<div class="github-stats">',
                        '<a class="watchers" href="' + res.repoUrl + '/watchers" title="See watchers">' + res.watchers + '</a>',
                        '<a class="forks" href="' + res.repoUrl + '/network/members" title="See forkers">' + res.forks + '</a>',
                        '</div>',
                    '</div>',
                    '<div class="github-box-content">',
                        '<p class="description"><span>' + res.description + '</span> &mdash; <a href="' + res.repoUrl + '#readme">Read More</a></p>',
                        '<p class="link"><a href="' + url + '">' + url + '</a></p>',
                    '</div>',
                    '<div class="github-box-download">',
                        '<div class="updated">Latest commit to the <strong>' + res.branch + '</strong> branch on ' + pushed_at + '</div>',
                        '<a class="download" href="' + res.repoUrl + '/zipball/master" title="Get an archive of this repository">Download as zip</a>',
                    '</div>',
                '</div>'
            ].join('');

            return els;
        },
        parseEls: function () {
            var res = {},
                rate,
                error;

            this.each(this.container, function (els) {
                var repo       = els.getAttribute('data-repo'),
                    vendorName = repo.split('/')[0],
                    repoName   = repo.split('/')[1],
                    vendorUrl  = "http://github.com/" + vendorName,
                    repoUrl    = "http://github.com/" + vendorName + '/' + repoName;

                this.jsonp(this.endpoint + repo, function (data) {
                    rate = data.meta.status;
                    res = {
                        'vendor': vendorName,
                        'name': repoName,
                        'vendorUrl': vendorUrl,
                        'repoUrl': repoUrl,
                        'description': data.data.description,
                        'branch': data.data.default_branch,
                        'watchers': data.data.watchers,
                        'forks': data.data.forks,
                        'pushed': data.data.pushed_at,
                        'homepage': data.data.homepage
                    };

                    if (rate === 200) {
                        els.innerHTML = this.attach(res);
                    } else {
                        error = data.data.message;
                        els.innerHTML = '<p class="danger">' + error + '</p>';
                    }
                }.bind(this));
            }.bind(this));
        },
        fetch: function () {
            this.parseEls();
        }
    };

    return GitRepo;
}));