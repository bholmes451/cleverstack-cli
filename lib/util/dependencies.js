var Promise = require('bluebird')
  , path    = require('path')
  , async   = require('async')
  , fs      = require('fs')
  , install = require(path.join(__dirname, '..', 'install'));

/**
 * Installs CleverStack modules listed within the bundleDependencies array
 *
 * @param  {String} project
 * @param  {Array} deps
 * @return {Promise}
 * @api public
 */
function installBundledModules(project, deps, projectDir) {
  return new Promise(function(resolve, reject) {
    deps = Array.isArray(deps) ? deps : [ deps ];

    var _path = typeof projectDir !== 'undefined' ? projectDir : project;

    if (deps.length < 1) {
      return new Promise(function(res) {
        res();
      });
    }

    async.filter(
      deps,
      function(dep, cb) {
        fs.exists(path.join(_path, dep), function(exists) {
          cb(!exists);
        });
      },
      function(_deps) {
        if (_deps.length < 1) {
          return resolve();
        }

        lib.utils
          .info('  Installing modules: ' + _deps.join(' '))
          .expandProgress(_deps.length);

        var cwd = process.cwd();

        process.chdir(_path);
        install.run(_deps)
          .then(function() {
            process.chdir(cwd);
            resolve();
          }, function(err) {
            process.chdir(cwd);
            reject(err);
          });
      });
  });
}
exports.installBundledModules = installBundledModules;


/**
 * Installs bundleDependencies through lib.project.installBundledModules if applicable
 *
 * @param  {String} projectDir
 * @return {Promise}
 * @api public
 */
function installBundleDeps(moduleDir, projectDir) {
  return new Promise(function(res, rej) {
    var pkg = require(path.join(moduleDir, 'package.json'));

    if (!pkg.hasOwnProperty('bundledDependencies') || pkg.bundledDependencies.length < 1) {
      return res();
    }

    lib.utils.info('  Installing bundled dependencies within ' + moduleDir);
    installBundledModules(moduleDir, pkg.bundledDependencies, projectDir).then(function() {
      res();
    })
    .catch(rej);
  });
}
exports.installBundleDeps = installBundleDeps;

/**
 * Adds modules to the backend's bundledDependencies automatically
 * with dependency management
 *
 * @todo investigate DepTree's issue with bundledDependencies that depend on each other!
 * @param   {Object}  backendPath Path to the backend folder
 * @return  {Promise}
 * @api public
 */
function addToMainBundleDeps(backendPath) {
  return new Promise(function(resolve, reject) {
    var pkgPath = path.join(backendPath.moduleDir, 'package.json')
      , pkg     = require(pkgPath)
      , deps    = [];

    var walk = require('findit')(path.join(backendPath.moduleDir, backendPath.modulePath));
    walk.on('file', function(file) {
      if (path.basename(file) === 'package.json') {
        var _pkg = require(file);
        _pkg.bundledDependencies = _pkg.bundledDependencies || [];

        if (deps.indexOf(_pkg.name) === -1) {
          deps.push(_pkg.name);
        }

        _pkg.bundledDependencies.forEach(function(dep){
          if (deps.indexOf(dep) === -1) {
            deps.push(dep);
          }
        });
      }
    });

    walk.on('end', function() {

      pkg.bundledDependencies = deps;

      fs.writeFile(pkgPath, JSON.stringify(pkg, null, '  '), function(err) {
        if (!!err) {
          return reject(err);
        }

        resolve();
      });
    });
  });
}
exports.addToMainBundleDeps = addToMainBundleDeps;
