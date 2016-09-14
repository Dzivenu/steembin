const cheerio = require('cheerio');
const request = require('superagent');
const fs = require('fs');
const _ = require('lodash');
const mkdirp = require('mkdirp');

function urlType(url) {
  if (/github/.test(url)) {
    return 'github';
  }

  if (/gitlab/.test(url)) {
    return 'gitlab';
  }

  return 'unknown';
}

function whileNoError(fn, cb, i, acc) {
  fn(i++, function(err, results) {
    if (err && err.response && err.response.status === 404) return cb(null, acc);
    else if (err) return cb(err);
    else whileNoError(fn, cb, i++, acc.concat(results));
  });
}

whileNoError(getThemes, function(err, allResults) {
  if (err) throw err;
  const typedResults = allResults.map((result) => {
    return _.extend(result, {
      url_type: urlType(result.url),
    });
  });

  const groups = _.groupBy(typedResults, 'url_type');
  console.log('GitHub Repositories:', groups.github ? groups.github.length : 0)
  console.log('GitLab Repositories:', groups.gitlab ? groups.gitlab.length : 0)
  console.log('Unknown:', groups.unknown ? groups.unknown.length : 0)

  groups.github.forEach((theme) => {
    const target = theme.url + '/archive/master.zip';
    mkdirp.sync('./views/themes/' + theme.name);
    fs.writeFileSync('./views/themes/' + theme.name + '.json', JSON.stringify(theme, null, 2))
    console.log('Write ' + theme.name + '.json...');
    console.log('Downloading ' + theme.name + '...');
    const outS = request.get(target)
      .pipe(fs.createWriteStream('./views/themes/' + theme.name + '/master.zip'))
      .on('done', () => console.log('Downloaded ' + theme.name))
      .on('error', () => console.log('Error ' + theme.name));
  });
}, 1, []);

function getThemes(page, cb) {
  page || (page = '1');
  console.log('Scrapping', page);
  request
    .get(`https://marketplace.ghost.org/themes/free/page/${page}`)
    .end((err, res) => {
      if (err) {
        cb(err);
        return;
      }

      const $ = cheerio.load(res.text);
      const themes = $('.post').map((i,el) => {
        return {
          url: $(el).find('.image').attr('href'),
          name: $(el).find('.theme-name').text(),
          author: $(el).find('.developer-name').text(),
          author_url: $(el).find('.developer-name').attr('href'),
          image_url: 'http://' + $(el).find('img').attr('src'),
        };
      }).get();
      cb(null, themes);
    });
}
