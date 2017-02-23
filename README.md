# sequelize-paginate

sequelize plugin to paginate query response using scope.

# NOTE

This plugin use 'number' and 'size' for pagination.

- `number` is a integer and begins from 1.
- `size` is a integer and should be larger than 0.

# Usage

## Configuration

Pass Sequelize model class to make the model class paginatable.

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
Pagination.paginatable(Service);
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

// Use `pagination` class method to get pagination config.
ModelClass.pagination
=> {size: 10}
```
