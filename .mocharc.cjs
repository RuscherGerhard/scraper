

// This is a JavaScript-based config file containing every Mocha option plus others.
// If you need conditional logic, you might want to use this type of config,
// e.g. set options via environment variables 'process.env'.
// Otherwise, JSON or YAML is recommended.

module.exports = {
  'allow-uncaught': false,
  'async-only': false,
  bail: false,
  'check-leaks': true,
  color: true,
  delay: false,
  diff: true,
  exit: true, // could be expressed as "'no-exit': true"
  extension: ['js', 'cjs', 'mjs'],
  'fail-zero': true,
//   fgrep: 'something', // fgrep and grep are mutually exclusive
//   file: ['/path/to/some/file', '/path/to/some/other/file'],
  'forbid-only': false,
  'forbid-pending': false,
  'full-trace': false,
  global: ['jQuery', '$'],
  grep: 'Test',///something/i, // also 'something', fgrep and grep are mutually exclusive
  growl: false,
  // ignore: ['/path/to/some/ignored/file'],
  'inline-diffs': false,
  // invert: false, // needs to be used with grep or fgrep
  jobs: 1,
  'node-option': ['unhandled-rejections=strict'], // without leading "--", also V8 flags
  package: './package.json',
  parallel: false,
  recursive: true,
  reporter: 'spec',
  'reporter-option': ['foo=bar', 'baz=quux'], // array, not object
  require: 'ts-node/register',
  retries: 1,
  slow: '75',
  sort: false,
  spec: ['application/test/**/*.spec.js'], // the positional arguments!
  timeout: '2000', // same as "timeout: '2s'"
  // timeout: false, // same as "timeout: 0"
  'trace-warnings': true, // node flags ok
  ui: 'bdd',
  'v8-stack-trace-limit': 100, // V8 flags are prepended with "v8-"
  watch: false,
  'watch-files': ['lib/**/*.js', 'test/**/*.jsnpm install', 'application/test/**/*.spec.js'],
  'watch-ignore': ['lib/vendor']
};