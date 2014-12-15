node-sqlite-mapper
==================

A Sqlite DataMapper that provides base functionality for working with Sqlite databases.

##Getting started
```
npm install sqlite-mapper
```

Basic usage can be run on the base SqliteMapper type.

```javascript
// load the module
var SqliteMapper = require('sqlite-mapper');

// create a mapper
var mapper = new SqliteMapper(path);

// execute a command
mapper.run('insert into stuff values (1, "test");')
.then(function(result) {
  console.log('inserted record %d', result.lastID);
});
```  


##Options

####run
/**
 * Runs INSERT, UPDATE, DELETE statements
 * @param {String} sql - The SQL statement to execute
 * @param {Object} [params] - The optional params to apply to the statement
 * @param {Function} [next] - The optional callback to exdcute
 * @return {Promise} - Will resolve to an object with lastID and changes
 */

####get
/**
 * Runs a SELECT for a single row result
 * @param {string} sql - The SQL statement to execute
 * @param {object} [params] - The optional params to apply to the statement
 * @param {function} [next] - The optional callback to exdcute
 * @return {Promise} - Will resolve with the found record
 */

####all
/**
 * Runs a SELECT for a all rows in the statement
 * @param {string} sql - The SQL statement to execute
 * @param {object} [params] - The optional params to apply to the statement
 * @param {function} [next] - The optional callback to exdcute
 * @return {Promise} - Will resolve with the found records as an array 
 */


##Contributing
In leui of a style-guide please follow existing patterns and add appropriate unit tests.

You can validate your code with `grunt validate`
