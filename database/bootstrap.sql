DROP USER if EXISTS test_user;
CREATE USER test_user WITH PASSWORD 'test';

CREATE DATABASE ci_test
  OWNER 'test_user'
;
