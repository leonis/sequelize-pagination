'use strict';

/**
 * Calculate offset
 *
 * @param {Number} pageSize - size per page.
 * @param {Number} pageNumber - number of the page.
 * @return {Number} limit value to adopt sql query.
 */
const calcOffset = (pageSize, pageNumber) => {
  if (pageNumber < 1) {
    return 0;
  }

  return (pageNumber - 1) * pageSize;
};

/**
 * Parse value to integer.
 *
 * @param {String|Number} value - target value.
 * @param {Number} defaultValue - default value.
 * @return {Number} parsed value (default value if parse failed.)
 */
const parseToInt = (value, defaultValue) => {
  if (value === undefined) {
    return defaultValue;
  }

  try {
    const v = parseInt(value);
    if (v < 0) {
      return defaultValue;
    }

    return v;
  } catch (err) {
    return defaultValue;
  }
};

/**
 * Parse parameter object to pagination info.
 *
 * @param {Object} page - page object.
 * @param {Number|String} page.size - size per page.
 * @param {Number|String} page.number - number of page.
 * @return {Object} pagination info which contains pageNumber and pageSize properties.
 */
const parseParams = (page, options) => {
  return {
    pageNumber: parseToInt(page.number, 1),
    pageSize: parseToInt(page.size, options.size)
  }
};

/**
 * Calculate pagination info.
 *
 * @param {Object} page - parameter object.
 * @param {Number|String} page.size - size per page.
 * @param {Number|String} page.number - number of page.
 * @param {Object} options - options which contains default config.
 * @return {Object} pagination info which contains limit , offset properties.
 */
const calcPagination = (page, options) => {
  const parsed = parseParams(page, options);

  return {
    limit: parsed.pageSize,
    offset: calcOffset(parsed.pageSize, parsed.pageNumber),
  };
};

const DefaultConfig = {
  size: 20
};

class Pagination {
  constructor() {
    this.options = DefaultConfig;
  }

  configure(options) {
    this.options = Object.assign({}, this.options, options);
  }

  /**
   * Make paginatable the Sequelize.Model.Instance class
   *
   * @param {Sequelize.Model.Instance} cls - sequelize model class.
   * @param {Object} options - options
   * @param {Number} options.page_size - size per page.
   * @return {Sequelize.Model.Instance} extended Sequelize Model class.
   */
  paginatable(cls, options) {
    const opts = Object.assign({}, this.options, options);

    cls.pagination = opts;

    cls.addScope('paginate', function(params) {
      const result = calcPagination(params, this.pagination);
      console.log('Result', result);

      return result;
    });

    cls.nextPage = function(page) {
      const parsed = parseParams(page, cls.pagination);

      return {
        number: (parsed.pageNumber + 1),
        size: parsed.pageSize
      };
    };

    return cls;
  }
}

module.exports = new Pagination();
