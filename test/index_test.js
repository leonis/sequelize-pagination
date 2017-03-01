'use strict';

const co = require('co');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const Util = require('./support/util.js');
const Pagination = require('../index.js');
const User = Pagination.paginatable(require('./support/model.js'));

const makeIds = (start, count) => {
  return Array.from(new Array(count)).map((_, i) => {
    return i + start;
  });
};

/* eslint-disable max-nested-callbacks */
describe('Pagination', () => {
  before(Util.init);
  after(Util.cleanup);

  describe('configure', () => {
    describe('with undefined', () => {
      let org;
      before(() => {
        org = Object.assign({}, Pagination.options);
      });
      after(() => {
        Pagination.options = org;
      });

      it('should not change global config', () => {
        const options = Object.assign({}, Pagination.options);
        Pagination.configure();
        expect(Pagination.options).to.eql(options);
      });
    });

    describe('with new config', () => {
      let org;
      before(() => {
        org = Object.assign({}, Pagination.options);
      });
      after(() => {
        Pagination.options = org;
      });

      it('should has new config', () => {
        const options = Object.assign({}, Pagination.options);
        Pagination.configure({size: 50});

        const current = Pagination.options;
        expect(current.size).to.not.eq(options.size);
        expect(current.size).to.eq(50);
      });
    });
  });

  describe('paginatable', () => {
    it('should extend model', () => {
      expect(User.pagination).to.eql({size: 20});
      expect(User.options.scopes.paginate).to.not.eq(undefined);
      expect(User.nextPage).to.not.eq(undefined);
      expect(User.currentPage).to.not.eq(undefined);
    });
  });

  describe('paginate', () => {
    describe('with undefined', () => {
      it('should return first page', (done) => {
        co(function * () {
          const params = undefined;
          const userIds = yield User.scope({method: ['paginate', params]})
            .findAll({order: 'id'})
            .then((users) => {
              return users.map((user) => {
                return user.getDataValue('id');
              });
            });

          expect(userIds).to.eql(makeIds(0, 20));
        })
        .then(done)
        .catch(done);
      });
    });

    describe('with empty object', () => {
      it('should return first page', (done) => {
        co(function * () {
          const params = {};
          const users = yield User.scope({method: ['paginate', params]}).findAll({order: 'id'});
          const userIds = users.map((user) => {
            return user.getDataValue('id');
          });

          expect(userIds).to.eql(makeIds(0, 20));
        })
        .then(done)
        .catch(done);
      });
    });

    describe('with invalid number value', () => {
      describe('when the value is a invalid string', () => {
        it('should return the first page', (done) => {
          co(function * () {
            const params = {number: 'test10', size: 10};
            const userIds = yield User.scope({method: ['paginate', params]}).findAll({order: 'id'})
              .then((users) => {
                return users.map((user) => {
                  return user.getDataValue('id');
                });
              });

            expect(userIds).to.eql(makeIds(0, 10));
          })
          .then(done)
          .catch(done);
        });
      });

      describe('when the value is a negative number string', () => {
        it('should return the first page', (done) => {
          co(function * () {
            const params = {number: '-10', size: 10};
            const userIds = yield User.scope({method: ['paginate', params]}).findAll({order: 'id'})
              .then((users) => {
                return users.map((user) => {
                  return user.getDataValue('id');
                });
              });

            expect(userIds).to.eql(makeIds(0, 10));
          })
          .then(done)
          .catch(done);
        });
      });

      describe('when the value is invalid object', () => {
        it('should return the first page', (done) => {
          co(function * () {
            const params = {number: {key: 'value'}, size: 10};
            const userIds = yield User.scope({method: ['paginate', params]}).findAll({order: 'id'})
              .then((users) => {
                return users.map((user) => {
                  return user.getDataValue('id');
                });
              });

            expect(userIds).to.eql(makeIds(0, 10));
          })
          .then(done)
          .catch(done);
        });
      });
    });

    describe('with invalid size value', () => {
      describe('when the value is a invalid string', () => {
        it('should return the page with default size', (done) => {
          co(function * () {
            const params = {number: 2, size: 'my favorite'};
            const userIds = yield User.scope({method: ['paginate', params]}).findAll({order: 'id'})
              .then((users) => {
                return users.map((user) => {
                  return user.getDataValue('id');
                });
              });

            expect(userIds).to.eql(makeIds(20, 20));
          })
          .then(done)
          .catch(done);
        });
      });

      describe('when the value is a negative number string', () => {
        it('should return the page with default size', (done) => {
          co(function * () {
            const params = {number: 1, size: '-30'};
            const userIds = yield User.scope({method: ['paginate', params]}).findAll({order: 'id'})
              .then((users) => {
                return users.map((user) => {
                  return user.getDataValue('id');
                });
              });

            expect(userIds).to.eql(makeIds(0, 20));
          })
          .then(done)
          .catch(done);
        });
      });

      describe('when the value is invalid object', () => {
        it('should return the page with default size', (done) => {
          co(function * () {
            const params = {number: 1, size: {key: 'value'}};
            const userIds = yield User.scope({method: ['paginate', params]}).findAll({order: 'id'})
              .then((users) => {
                return users.map((user) => {
                  return user.getDataValue('id');
                });
              });

            expect(userIds).to.eql(makeIds(0, 20));
          })
          .then(done)
          .catch(done);
        });
      });
    });
  });

  describe('currentPage', () => {
    describe('when valid params', () => {
      it('should return currentPage', () => {
        const params = {number: '30', size: '10'};
        const result = User.currentPage(params);
        expect(result).to.eql({number: 30, size: 10});
      });
    });

    describe('when params is undefined', () => {
      it('should return first page as currentPage', () => {
        const params = undefined;
        const result = User.currentPage(params);
        expect(result).to.eql({number: 1, size: 20});
      });
    });
  });

  describe('nextPage', () => {
    describe('when valid params', () => {
      it('should return nextPage object', () => {
        const params = {number: '2', size: '30'};
        const result = User.nextPage(params);
        expect(result).to.eql({number: 3, size: 30});
      });
    });

    describe('when params is undefined', () => {
      it('should return second page as nextPage', () => {
        const params = undefined;
        const result = User.nextPage(params);
        expect(result).to.eql({number: 2, size: 20});
      });
    });
  });
});
/* eslint-enable max-nested-callbacks */
