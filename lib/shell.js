// copied from https://github.com/eslint/eslint-release/blob/master/lib/shell-ops.js and slightly modified
const path = require('path');
const childProcess = require('child_process');

/**
 * Exits the process with the given code. This is just a wrapper around
 * process.exit to allow for easier stubbing and testing.
 * @param {int} code The exit code.
 * @returns {void}
 */
const exit = code => {
    process.exit(code); // eslint-disable-line no-process-exit
};

/**
 * Returns an environment object that has been modified to work with local
 * nod executables.
 * @param {string} [platform] Platform identifier (same values as process.platform).
 * @param {Object} [defaultEnv] The default environment object (mostly used for testing).
 * @returns {Object} a modified environment object.
 */
const getModifiedEnv = (platform, defaultEnv) => {
    const newPlatform = platform || process.platform;
    const newDefaultEnv = defaultEnv || process.env;
    const env = {};
    const pathSeparator = (newPlatform === 'win32') ? ';' : ':';

    Object.keys(newDefaultEnv).forEach(key => {
        env[key] = newDefaultEnv[key];
    });

    // modify PATH to use local node_modules
    env.PATH = `${path.resolve(__dirname, '../node_modules/.bin')}${pathSeparator}${env.PATH}`;

    return env;
};

/**
 * Executes a command and returns the output instead of printing it to stdout.
 * If there's an error, then the process exits and prints out the error info.
 * @param {string} cmd The command string to execute.
 * @returns {string} The result of the executed command.
 * @private
 */
const execSilent = cmd => {
    try {
        return childProcess.execSync(cmd, {
            cwd: process.cwd(),
            env: getModifiedEnv()
        }).toString();
    } catch (ex) {
        console.error(ex.output[1].toString()); // eslint-disable-line no-console

        exit(ex.status);

        return null;
    }
};

/**
 * Executes a command.
 * @param {string} cmd The command to execute.
 * @returns {void}
 * @throws {Error} If the command exits with a nonzero exit code.
 * @private
 */
const exec = cmd => {
    const result = execSilent(cmd);

    console.log(result); // eslint-disable-line no-console
};

module.exports = {
    getModifiedEnv,
    execSilent,
    exec,
    exit
};
