(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.GitRepo = factory(root);
    }
})(this, function () {
    'use strict';

    var GitRepo = function () {
        if (!this || !(this instanceof GitRepo)) {
            return new GitRepo(options);
        }

        this.container = document.querySelectorAll('.github-widget');
        this.endpoint  = 'https://api.github.com/repos/';

        this.fetch();
    };

    GitRepo.init = function () {
        return new GitRepo();
    };

    GitRepo.prototype = {
        each: function (els, callback) {
            var i = 0, max = els.length;
            while (i < max) {
                callback(els[i], i);
                i += 1;
            }
        },
        attach: function (res) {
            var pushed_at = 'unknown', url, date;

            if (res.pushed) {
                date      = new Date(res.pushed);
                pushed_at = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
            }

            if (res.homepage !== null) {
                url = res.homepage;
            } else {
                url = '';
            }

            var els = [
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
            var self = this,
                res  = {},
                rate,
                error;

            this.each(this.container, function (els) {
                var repo       = els.getAttribute('data-repo'),
                    vendorName = repo.split('/')[0],
                    repoName   = repo.split('/')[1],
                    vendorUrl  = "http://github.com/" + vendorName,
                    repoUrl    = "http://github.com/" + vendorName + '/' + repoName;

                loadJSONP(self.endpoint + repo, function (data) {
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
                        els.innerHTML = self.attach(res);
                    } else {
                        error = data.data.message;
                        els.innerHTML = '<p class="danger">' + error + '</p>';
                    }
                });
            });
        },
        fetch: function () {
            this.parseEls();
        }
    };

    var loadJSONP = (function () {
        var id = 0, head, externalScript;
        head = document.head || document.getElementsByTagName('head')[0];
        externalScript = document.createElement('script');
        externalScript.type = 'text/javascript';

        return function (url, callback, context) {
            var name = 'jsonp_' + id++, script;

            if (url.match(/\?/)) {
                url += '&callback=' + name;
            } else {
                url += '?callback=' + name;
            }

            script = externalScript.cloneNode();
            script.src = url;

            window[name] = function (data) {
                callback.call((context || window), data);
                head.removeChild(script);
                script = null;
                delete window[name];
            }

            head.appendChild(script);
        }
    }());

    return GitRepo;
});