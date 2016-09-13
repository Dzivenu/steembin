const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const themes = fs.readdirSync('./views/themes')
  .filter(fp => path.extname(fp) === '.json')
  .map(fp => {
    const theme = require('./views/themes/' + fp)
    return _.extend(theme, {
      filepath: './themes/' + theme.name + '/' +
        fs.readdirSync('./views/themes/' + path.basename(fp, '.json'))
          .filter(d => path.extname(d) !== '.zip')[0],
    });
  });

exports = module.exports = themes;
exports.byName = _.keyBy(themes, 'name');
