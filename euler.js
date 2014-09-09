var fs        = require('fs');
var join      = require('path').join;
var assert    = require('assert');
var challenge = require('code-challenge');
var resources = require('./data/resources');

/**
 * Location of the problem file.
 *
 * @type {String}
 */
var PROBLEM_FILE = join(__dirname, 'data/problems.txt');

/**
 * Location of the solution file.
 *
 * @type {String}
 */
var SOLUTIONS_FILE = join(__dirname, 'data/solutions.txt');

/**
 * Set the challenge name.
 *
 * @type {String}
 */
challenge.name = 'Project Euler';

/**
 * Map of solutions.
 *
 * @type {Array}
 */
var solutions = fs.readFileSync(SOLUTIONS_FILE, 'utf8')
  .split('\n')
  .map(function (solution, index) {
    return solution.replace((index + 1) + '. ', '');
  });

/**
 * Read the problem file and split into sets.
 */
fs.readFileSync(PROBLEM_FILE, 'utf8')
  .split('\n\n\n')
  .forEach(function (problemText, index) {
    var name = 'Problem ' + (index + 1);
    var text = problemText.substr(name.length * 2 + 3);

    challenge.exercise(name)
      .add('print', function () {
        var resource = resources[index + 1];

        // Make sure the resource is an array.
        if (resource && !Array.isArray(resource)) {
          resource = [resource];
        }

        console.log(text);

        if (resource) {
          console.log();
          console.log('Resources:');
          console.log();

          // Log each of the resources.
          resource.forEach(function (file) {
            console.log(join(__dirname, 'data/resources', file));
          });
        }

        console.log();
        console.log(
          'To work on a solution you will need to create a file with your ' +
          'preferred language. The solution should be logged to stdout and ' +
          'once you think you have a working solution, use ' +
          '`challenge verify [file]` to pass the exercise.'
        );
      })
      .add('verify', function () {
        return challenge.execFile(this._[0])
          .spread(function (stdout) {
            assert.equal(stdout.replace(/\r?\n$/, ''), solutions[index]);
          });
      });
  });
