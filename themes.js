const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const themes = fs.readdirSync('./views/layouts/themes')
  .filter(fp => path.extname(fp) === '.json')
  .map(fp => {
    const theme = require('./views/layouts/themes/' + fp)
    return _.extend(theme, {
      filepath: './layouts/themes/' + theme.name + '/' +
        fs.readdirSync('./views/layouts/themes/' + path.basename(fp, '.json'))
          .filter(d => path.extname(d) !== '.zip')[0],
    });
  });

exports = module.exports = themes;
exports.byName = _.keyBy(themes, 'name');
