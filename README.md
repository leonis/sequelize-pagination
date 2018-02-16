# sequelize-pagination

[![CircleCI](https://circleci.com/gh/leonis/sequelize-pagination/tree/master.svg?style=shield&circle-token=a3a6c6f7416a335be555cfbaf8e9e2cb126c2ec5)](https://circleci.com/gh/leonis/sequelize-pagination/tree/master)

`sequelize-pagination` is a Sequelize plugin to make the sequelize model paginatable.

# NOTE

This plugin use 'number' and 'size' parameters to paginate the sql query.

- `number` is a integer and begins from **1** (not 0).
- `size` is a integer and should be larger than 0.

# Usage

## Configuration

Just pass Sequelize model class to make the model class paginatable.

```javascript
'use strict';

const Pagination = require('../sequelize-paginate/index.js');
// configure if want to change global default.
// Pagination.configure({
//   size: 10
// });

// Extend model class.
const ModelClass = require('./path/to/model_class.js');

// This add these functionality.
// - pagination scope
// - nextPage as Class method.
Pagination.paginatable(ModelClass);

// Model level config supported.
Pagination.paginatable(ModelClass, {size: 40});
```

## HowToUse

Use `paginate` scope to fetch the resources.

```javascript
const params = {
  size: 20,
  number: 2
};

// Use `paginate` scope to handle "number"/"size" parameter.
ModelClass.scope({method: ['paginate', params]}).findAll({order: 'id'})
=> {Promise<Array<ModelClass.Instance>>}

// Use `nextPage` class method to create next page parameter.
ModelClass.nextPage(params);
=> {size: 20, number: 3}

// When Pass total count to `nextPage`, return next page info if exists.
// NOTE: `nextPage` return `undefined` if next page does not exist.
ModelClass.nextPage(params, totalCount);
=> {size: 20, number: 3}

// Use `hasNextPage` method to check whether next page exists, or not.
ModelClass.hasNextPage(params, totalCount);
=> true

// Use `pagination` class method to get pagination config.
ModelClass.pagination
=> {size: 10}
```

# HowToDevelop

## Prepare

### Install packages

```
$ cd path/to/this/repo/root
$ yarn install
```

### Define environment variables.

```
export TEST_DB=postgres://postgres:pass@127.0.0.1:5432/testdb
```

### Launch a database for test.

```
$ docker-compose up
```

### Test

Use tasks in package.json.

```
$ yarn run ci
```
