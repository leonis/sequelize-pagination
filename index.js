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
 * Check whether the value looks like number or not.
 *
 * @param {String|Number|Object} value - target value
 * @return {boolean} true if the value looks like number.
 */
const looksLikeNumber = (value) => {
  const cls = Object.prototype.toString.call(value).slice(8, -1);

  if (value === undefined || value === null) {
    return false;
  }

  if (cls === 'Number') {
    return true;
  }

  if (cls === 'String') {
    return (value.match(/^\d+$/));
  }

  return false;
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

  if (!looksLikeNumber(value)) {
    return defaultValue;
  }

  try {
    const v = parseInt(value, 10);
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
 * @param {Object} options - config object
 * @param {Number} options.size - size per page.
 * @return {Object} pagination info which contains pageNumber and pageSize properties.
 */
const parseParams = (page, options) => {
  const values = page || {};

  return {
    pageNumber: parseToInt(values.number, 1),
    pageSize: parseToInt(values.size, options.size)
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
      const parsed = parseParams(params, this.pagination);

      return {
        limit: parsed.pageSize,
        offset: calcOffset(parsed.pageSize, parsed.pageNumber)
      };
    }, {override: true});

    /**
     * Get current page
     *
     * @param {Object} page - page object
     * @param {Number|String} page.size - size per page.
     * @param {Number|String} page.number - number of the page.
     * @return {Object} current page info which contains number and size properties.
     */
    cls.currentPage = function(page) {
      const parsed = parseParams(page, cls.pagination);

      return {
        number: parsed.pageNumber,
        size: parsed.pageSize
      };
    };

    /**
     * Get next page
     *
     * NOTE:
     *   - When total parameter is given, this method return next page info only if the next page exists.
     *   - When total parameter is not given, this method always return next page info.
     *
     * @param {Object} page - page object
     * @param {Number|String} page.size - size per page.
     * @param {Number|String} page.number - number of the page.
     * @param {Number} total - total count
     * @return {Object|undefined} next page info which contains number and size properties. undefined when next page does not exists.
     */
    cls.nextPage = function(page, total) {
      const parsed = parseParams(page, cls.pagination);

      const currentPage = {
        number: parsed.pageNumber,
        size: parsed.pageSize
      };

      if (total === undefined || this.hasNextPage(currentPage, total)) {
        return {
          number: (currentPage.number + 1),
          size: currentPage.size
        };
      }

      return undefined;
    };

    /**
     * Check whether the next page exists, or not.
     *
     * @param {Object} page - page object
     * @param {Number} page.number - size per page.
     * @param {Number} page.size - number of the page.
     * @param {Number} total - total count of the resource.
     * @return {boolean} true if next page exists.
     */
    cls.hasNextPage = function(page, total) {
      const parsed = parseParams(page, cls.pagination);

      return (total > (parsed.pageNumber * parsed.pageSize));
    };

    return cls;
  }
}

module.exports = new Pagination();
