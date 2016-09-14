'use strict';
const Promise = require('bluebird');
const _ = require('lodash');
const bodyParser = require('body-parser');
const cacheManager = require('cache-manager');
const cookieParser = require('cookie-parser');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const expressPromise = require('express-promise');
const fs = require('fs');
const marked = require('marked');
const moment = require('moment');
const path = require('path');
const redisStore = require('cache-manager-redis');
const steem = require('steem');

const cache = cacheManager.caching({
  store: redisStore,
  url: process.env.REDIS_URL,
  ttl: 600,
});

const cachedGetStateAsync = (url) => cache.wrap('getState$' + url, () => {
  return steem.api.getStateAsync(url).spread(c => c);
});

const appName = 'steembin';
const app = express();
app.engine('.hbs', expressHandlebars({
  defaultLayout: 'main',
  extname: 'hbs',
}));
app.set('view engine', '.hbs');
app.use(expressPromise());
app.use(cookieParser());
app.use(bodyParser());

function patchLink(post) {
  // console.log(JSON.stringify(post));
  return _.extend(post, {
    author_link: 'https://steemit.com/@' + post.author,
    link: '/' + post.parent_permlink + '/' + post.author + '/' + post.permlink,
  });
}

function patchLinks(posts) {
  return _.map(posts, patchLink);
}

function wrap(fn) {
  const cfn = Promise.coroutine(fn);
  return function generated(req, res, next) {
    fn(req, res).catch(next);
  };
}

app.use('/static', express.static('./static'));
app.use('/themes', express.static('./views/themes'));

app.get('/', wrap(async (req, res) => {
  const state = await cachedGetStateAsync('/trending');
  const posts = patchLinks(state.content);
  //console.log(state.content);
  //console.log(posts);
  res.render('home', {
    appName,
    latest: posts,
  });
}));

const themes = require('./themes');
const ghThemes = _.filter(themes, {url_type: 'github'})

app.get('/themes', wrap(async (req, res) => {
  res.render('themes', {
    appName,
    themes: _.map(ghThemes, (t) => _.extend(t, {
      is_current: t.name === req.cookies.theme_name,
    })),
  });
}));

app.post('/themes', wrap(async (req, res) => {
  res.cookie('theme_name', req.body.theme_name);
  res.redirect('/themes');
}));

app.get('/:parent_permalink/:author/:permalink', wrap(async (req, res) => {
  const parent_permalink = req.params.parent_permalink;
  const author = req.params.author;
  const permalink = req.params.permalink;
  // console.log(
  //   `/${parent_permalink}/${author}/${permalink}`
  // );

  const state = await cachedGetStateAsync(
    `/${parent_permalink}/@${author}/${permalink}`
  );
  console.log(Object.keys(state.content))
  const post = _.extend(state.content[author + '/' + permalink], {
    body_html: marked(state.content[author + '/' + permalink].body, {
      sanitize: true,
      gfm: true,
    }),
  });
  let meta = {};
  try {
    meta = JSON.parse(post.json_metadata);
  } catch (err) {}
  //console.log(state.content, post, meta);

  const themeName = req.cookies.theme_name || meta.theme;
  if (themeName && themes.byName[themeName]) {
    const theme = themes.byName[themeName];
    if (theme) {
      const templates = await expressHandlebars.create({
        extname: '.hbs'
      }).getTemplates('./views/' + theme.filepath);
      // console.log(post);

      res.render(theme.filepath + '/post.hbs', {
        appName,
        post: _.extend(post, {
          content: post.body_html,
          author: {
            name: author,
            url: post.author_link,
          },
        }),
        post_class: 'post',
        partials: _.mapKeys(templates, (v, k) => path.basename(k, '.hbs')),
        templates: _.mapKeys(templates, (v, k) => path.basename(k, '.hbs')),
        layout: theme.filepath + '/default.hbs',
        helpers: {
          tags: () => meta.tags && meta.tags.join(', '),
          asset: (s) => '/' + theme.filepath + '/assets/' + s,
          date: () => moment(post.created).format('DD/MM/YYYY'),
          encode: (s) => s,
          url: (s) => s,
          is: () => {},
        }
      });
      return;
    }
  }

  // console.log(post)

  res.render('post', {
    appName,
    post,
  });
}));

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(`
    ${err.stack || JSON.stringify(err, null, 2)}
  `);
});

Promise.promisifyAll(steem.api, {
  multiArgs: true,
});

Promise.promisifyAll(steem.broadcast, {
  multiArgs: true,
});

if (!module.parent) {
  const port = process.env.PORT || 8888;
  app.listen(port, () => {
    console.log('Listening on port ' + port);
  });
}

exports.start = (cb) => {
  app.listen(8888, (err) => {
    cb(err);
  });
};
