const additionalArgs = require('minimist')(process.argv.slice(2))._;
const forEach = require('lodash/forEach');
const get = require('lodash/get');
const includes = require('lodash/includes');
const isEmpty = require('lodash/isEmpty');
const isObject = require('lodash/isObject');
const isUndefined = require('lodash/isUndefined');
const method = require('lodash/method');
const some = require('lodash/some');
const fs = require('fs');
const path = require('path');
const shelljs = require('shelljs');
const semver = require('semver');
const rc = require('rc');
const GitHub = require('github-api');
const dateformat = require('dateformat');
const ShellOps = require('./shell');
const SlackOps = require('./slack');
const HipchatOps = require('./hipchat');

const PUBLISHER_CONFIG = rc('npmpublisher');
const IS_PUBLIC = (additionalArgs[0] === 'public');
const COMMIT_TYPES = [
    'breaking',
    'build',
    'chore',
    'ci',
    'docs',
    'feat',
    'fix',
    'perf',
    'publish',
    'refactor',
    'revert',
    'squash',
    'style',
    'test',
    'upgrade'
];
const COMMIT_TYPE_TITLES = {
    breaking: 'Breaking Changes',
    feat: 'New Features',
    upgrade: 'Dependency Updates',
    other: 'Miscellaneous Updates'
};

/**
 * Loads the package.json file from the current directory.
 * @returns {void}
 * @private
 */
const getPackageInfo = () => {
    const filePath = path.join(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const scopeMatch = pkg.name.match(/@([A-Z])\w+\//gi); // matches '@scope/'

    if (isObject(pkg.repository)) {
        pkg.repository = pkg.repository.url
            .replace('git+', '')
            .replace('.git', '');
    }

    pkg.scope = (scopeMatch)
        ? scopeMatch[0]
            .replace('@', '')
            .replace('/', '')
        : null;

    return pkg;
};

/**
 * Run before a release to validate that the project is setup correctly.
 * @returns {void}
 * @private
 */
const validateSetup = () => {
    if (!shelljs.test('-f', 'package.json')) {
        console.error('Missing package.json file.'); // eslint-disable-line no-console

        ShellOps.exit(1);
    }

    const pkg = getPackageInfo();

    if (!pkg.repository) {
        console.error('The "repository" field is not specified in package.json.'); // eslint-disable-line no-console

        ShellOps.exit(1);
    }
};

/**
 * Determines the next prerelease version based on the current version.
 * @param {string} currentVersion The current semver version.
 * @param {string} prereleaseId The ID of the prelease (alpha, beta, rc, etc.)
 * @param {string} releaseType The type of prerelease to generate (major, minor, patch)
 * @returns {string} The prerelease version.
 * @private
 */
const getPrereleaseVersion = (currentVersion, prereleaseId, releaseType) => {
    const ver = new semver.SemVer(currentVersion);

    // if it's already a prerelease version
    if (ver.prerelease.length) {
        return ver.inc('prerelease', prereleaseId).version;
    } else {
        return ver.inc(`pre${releaseType}`, prereleaseId).version;
    }
};

/**
 * Returns the version tags from the git repository
 * @returns {string[]} Tags
 * @private
 */
const getVersionTags = () => {
    ShellOps.exec('git fetch --tags');

    const tags = ShellOps
        .execSilent('git tag')
        .trim()
        .split('\n');

    return tags.reduce((list, tag) => {
        if (semver.valid(tag)) {
            list.push(tag);
        }

        return list;
    }, []).sort(semver.compare);
};

/**
 * Extracts data from a commit log in the format --pretty=format:"* %h %s (%an)\n%b".
 * @param {string[]} logs Output from git log command.
 * @returns {Object} An object containing the data exracted from the commit log.
 * @private
 */
const parseLogs = logs => {
    const regexp = /^(?:\* )?([0-9a-f]{7,}) ((?:([a-z]+): ?)?.*) \((.*)\)/i;
    const parsed = [];

    logs.forEach(log => {
        const match = log.match(regexp);
        let title;
        let flag;

        if (match) {
            title = match[2];
            flag = match[3] ? match[3].toLowerCase() : null;

            parsed.push({
                raw: match[0],
                sha: match[1],
                title,
                titleWithoutFlag: (flag)
                    ? title.replace(`${flag}: `, '')
                    : title,
                flag,
                author: match[4],
                body: ''
            });
        } else if (parsed.length) {
            parsed[parsed.length - 1].body += `${log}\n`;
        }
    });

    return parsed;
};

/**
 * Given a list of parsed commit log messages, excludes revert commits and the
 * commits they reverted.
 * @param {Object[]} logs An array of parsed commit log messages.
 * @returns {Object[]} An array of parsed commit log messages.
 */
const excludeReverts = logs => {
    const newLogs = logs.slice();
    const revertRegex = /This reverts commit ([0-9a-f]{40})/;
    const shaIndexMap = Object.create(null); // Map of commit shas to indices
    let i;
    let log;
    let match;
    let sha;

    // iterate in reverse because revert commits have lower indices than the
    // commits they revert
    for (i = newLogs.length - 1; i >= 0; i--) {
        log = newLogs[i];
        match = log.body.match(revertRegex);

        if (match) {
            sha = match[1].slice(0, 7);

            // only exclude this revert if we can find the commit it reverts
            if (!isUndefined(shaIndexMap[sha])) {
                newLogs[shaIndexMap[sha]] = null;
                newLogs[i] = null;
            }
        } else {
            shaIndexMap[log.sha] = i;
        }
    }

    return newLogs.filter(Boolean);
};

/**
 * Inspects an array of git commit log messages and calculates the release
 * information based on it.
 * @param {string} currentVersion The version of the project read from package.json.
 * @param {string[]} logs An array of log messages for the release.
 * @param {string} [prereleaseId] If doing a prerelease, the prerelease identifier.
 * @returns {Object} An object containing all the changes since the last version.
 * @private
 */
const calculateReleaseFromGitLogs = (currentVersion, logs, prereleaseId) => {
    const pkg = getPackageInfo();
    const newLogs = excludeReverts(parseLogs(logs));
    const changelog = {
        other: {
            weight: 3,
            items: []
        }
    };
    const modifiedLogs = newLogs.map(log => {
        const tempDescription = log.body.split('* ');
        let title = log.titleWithoutFlag;
        let newItem;

        log.description = [];

        tempDescription.forEach(item => {
            newItem = item.replace(/[\r\n]/g, '');

            if (!isEmpty(newItem)) {
                const splitItems = newItem.split(':');

                if (splitItems.length > 1) {
                    newItem = `\`${splitItems.shift()}:\`${splitItems.join(':')}`;
                }

                log.description.push(newItem);
            }
        });

        // if a flag is not on the main title check the description commits to see if they have flags
        if (!log.flag) {
            if (some(log.description, method('match', 'breaking:'))) {
                log.flag = 'breaking';
            } else if (some(log.description, method('match', 'feat:'))) {
                log.flag = 'feat';
            } else if (some(log.description, method('match', 'upgrade:'))) {
                log.flag = 'upgrade';
            }
        }

        if (log.flag && (log.flag !== 'breaking' && log.flag !== 'feat' && log.flag !== 'upgrade')) {
            title = `\`${log.flag}:\` ${title}`;
        }

        // if title has the PR format in it, replace pull request match with URL to PR
        if (title.match(/\(#\d+\)/)) { // matches (#number)
            title = title.replace(/(\()#(\d+)(\))/, `$1[#$2](${pkg.repository}/pull/$2)$3`);
        }

        return {
            ...log,
            output: `* [[${log.sha}](${pkg.repository}/commit/${log.sha})] - ${title} (${log.author})`
        };
    });
    const releaseInfo = {
        version: currentVersion,
        type: '',
        changelog,
        rawChangelog: modifiedLogs.map(log => {
            return log.output;
        }).join('\n')
    };

    // arrange change types into categories
    modifiedLogs.forEach(log => {
        // if descriptions exist in log, add them to the output as items
        if (log.description.length) {
            log.description.forEach(item => {
                log.output += `\n\t* ${item}`;
            });
        }

        // exclude untagged (e.g. revert) commits from version calculation
        if (!log.flag || !includes(COMMIT_TYPES, log.flag)) {
            changelog.other.items.push(log.output);

            return;
        }

        if (!changelog[log.flag]) {
            changelog[log.flag] = {
                weight: 2,
                items: []
            };
        }

        changelog[log.flag].items.push(log.output);
    });

    if (changelog.breaking) {
        changelog.breaking.weight = 1;
        releaseInfo.type = 'major';
    } else if (changelog.feat || changelog.upgrade) {
        releaseInfo.type = 'minor';
    } else {
        releaseInfo.type = 'patch';
    }

    // increment version from current version
    releaseInfo.version = (
        (prereleaseId)
            ? getPrereleaseVersion(currentVersion, prereleaseId, releaseInfo.type)
            : semver.inc(currentVersion, releaseInfo.type)
    );

    return releaseInfo;
};

/**
 * Gets all changes since the last tag that represents a version.
 * @param {string} [prereleaseId] The prerelease identifier if this is a prerelease.
 * @returns {Object} An object containing all the changes since the last version.
 * @private
 */
const calculateReleaseInfo = prereleaseId => {
    // get most recent tag
    console.log('calculateReleaseInfo - Getting package info.');
    const pkg = getPackageInfo();
    console.log('calculateReleaseInfo - Getting version tags.');
    const tags = getVersionTags();
    const lastTag = tags[tags.length - 1];
    const commitRange = (lastTag) ? `${lastTag}..HEAD` : '';
    console.log(tags, lastTag, commitRange);
    const logs = ShellOps
        .execSilent(`git log --no-merges --pretty=format:"* %h %s (%an)%n%b" ${commitRange}`)
        .split(/\n/g);
        console.log('calculateReleaseInfo - calculateReleaseFromGitLogs');
    const releaseInfo = calculateReleaseFromGitLogs(pkg.version, logs, prereleaseId);

    releaseInfo.repository = pkg.repository;

    return releaseInfo;
};

/**
 * Outputs the changelog to disk.
 * @param {Object} releaseInfo The information about the release.
 * @param {string} releaseInfo.version The release version.
 * @param {Object} releaseInfo.changelog The changelog information.
 * @returns {void}
 */
const writeChangelog = releaseInfo => {
    // get most recent two tags
    const timestamp = dateformat(new Date(), 'mm/dd/yyyy');
    const sortedChangelog = {};
    const miscCommits = [];
    let isFirstLabel = true;
    let hasOtherLabel = false;
    let label;

    // sort the changelog by weight so that most important items appear first
    Object
        .keys(releaseInfo.changelog).sort((a, b) => {
            return releaseInfo.changelog[b].weight < releaseInfo.changelog[a].weight;
        })
        .forEach(key => {
            sortedChangelog[key] = releaseInfo.changelog[key];
        });

    // output header
    shelljs.ShellString(`# ${releaseInfo.version} - ${timestamp}\n`).to('CHANGELOG.tmp');

    // output changelog
    forEach(sortedChangelog, (commitsData, commitsType) => {
        hasOtherLabel = (commitsType === 'other' && commitsData.items.length);
        label = COMMIT_TYPE_TITLES[commitsType];

        if (label) {
            if ((commitsType !== 'other' && commitsType !== 'squash' && commitsType !== 'publish') || hasOtherLabel) {
                if (!isFirstLabel) {
                    shelljs.ShellString('\n').toEnd('CHANGELOG.tmp');
                }

                shelljs.ShellString(`## ${label}\n`).toEnd('CHANGELOG.tmp');
            }

            isFirstLabel = false;
        }

        commitsData.items.forEach(commit => {
            if (commitsType === 'squash' || commitsType === 'publish') { return; }

            if (label && commitsType !== 'other') {
                // output the commits that fall under an important label
                shelljs.ShellString(`${commit}\n`).toEnd('CHANGELOG.tmp');
            } else {
                // otherwise add them to the misc changes list
                miscCommits.push(commit);
            }
        });
    });

    if (!hasOtherLabel && miscCommits.length) {
        // the "other" label hasn't been printed yet so print it
        shelljs.ShellString(`\n## ${COMMIT_TYPE_TITLES.other}\n`).toEnd('CHANGELOG.tmp');
    }

    // output all the misc commits under the proper label
    miscCommits.forEach(commit => {
        shelljs.ShellString(`${commit}\n`).toEnd('CHANGELOG.tmp');
    });

    // ensure there's a CHANGELOG.md file
    if (!shelljs.test('-f', 'CHANGELOG.md')) {
        fs.writeFileSync('CHANGELOG.md', '');
    } else {
        shelljs.ShellString('\n').toEnd('CHANGELOG.tmp');
    }

    // switch-o change-o
    fs.writeFileSync('CHANGELOG.md.tmp', shelljs.cat('CHANGELOG.tmp', 'CHANGELOG.md'));
    shelljs.rm('CHANGELOG.tmp');
    shelljs.rm('CHANGELOG.md');
    shelljs.mv('CHANGELOG.md.tmp', 'CHANGELOG.md');
};

/**
 * Publishes the release information to GitHub.
 * @param {Object} releaseInfo The release information object.
 * @returns {Promise} A promise that resolves when the operation is complete.
 * @private
 */
const publishReleaseToGitHub = ({releaseInfo, pkg, rcConfig}) => {
    /* eslint-disable no-console */
    const repoParts = releaseInfo.repository.split('/');
    const gh = new GitHub({token: rcConfig.github.accessToken});
    const repo = gh.getRepo(repoParts[3], repoParts[4]);

    return repo
        .createRelease({
            tag_name: `v${releaseInfo.version}`, // eslint-disable-line camelcase
            body: releaseInfo.rawChangelog,
            prerelease: Boolean(semver.prerelease(releaseInfo.version))
        })
        .then(() => {
            console.log('Posted release notes to GitHub.');
        })
        .catch(err => {
            console.error('Could not post release notes to GitHub.');

            if (err.message) {
                console.error(err.message);
            }
        });
    /* eslint-enable no-console */
};

const generateUnsetError = item => {
    return `${item} configuration not provided in .npmpublisherrc file. If you'd like to use the ${item} integration, please see the configuration docs (https://github.com/spothero/npm-publisher#usage).`;
};

/**
 * Creates a release version tag and pushes to origin and npm.
 * @param {string} [prereleaseId] The prerelease ID (alpha, beta, rc, etc.).
 *      Only include when doing a prerelease.
 * @returns {Object} The information about the release.
 */
const release = prereleaseId => {
    const pkg = {
        ...getPackageInfo(),
        isPublic: IS_PUBLIC
    };
    const scopeConfig = PUBLISHER_CONFIG[pkg.scope];
    const rcConfig = (scopeConfig)
        ? scopeConfig
        : (PUBLISHER_CONFIG.default)
            ? PUBLISHER_CONFIG.default
            : null;
    const publishCommand = `npm publish${(IS_PUBLIC) ? ' --access public' : ''}`;

    /* eslint-disable no-console */
    validateSetup();

    console.log('Installing the latest npm modules.');

    ShellOps.exec('npm install');

    console.log('Calculating changes for release.');

    const releaseInfo = calculateReleaseInfo(prereleaseId);

    console.log(`Release is version ${releaseInfo.version}.`);
    console.log('Generating Changelog.');

    writeChangelog(releaseInfo);

    console.log('Committing to git.');

    ShellOps.exec('git add -A');
    ShellOps.exec(`git commit -m "publish: Changelog update for ${releaseInfo.version} release"`);

    console.log(`Generating v${releaseInfo.version} release.`);

    ShellOps.execSilent(`npm version ${releaseInfo.version}`);

    console.log('Publishing tag to GitHub.');

    ShellOps.exec('git push origin master --tags');

    console.log(`Publishing as a ${(IS_PUBLIC) ? 'public' : 'private'} package to npm.`);

    if (prereleaseId) {
        ShellOps.exec(`${publishCommand} --tag next`);
    } else {
        ShellOps.exec(publishCommand);
    }

    ShellOps.exec('git add -A');
    ShellOps.exec('git diff --quiet && git diff --staged --quiet || git commit -am "publish: Post-publish add of untracked files"');
    ShellOps.exec('git push origin master');

    if (get(rcConfig, 'github.accessToken')) {
        publishReleaseToGitHub({
            releaseInfo,
            pkg,
            rcConfig
        });
    } else {
        console.log(generateUnsetError('GitHub'));
    }

    if (get(rcConfig, 'slack.channelId') && get(rcConfig, 'slack.botUserToken')) {
        SlackOps.notifyChannel({
            pkg,
            releaseInfo,
            rcConfig
        });
    } else {
        console.log(generateUnsetError('Slack'));
    }

    if (get(rcConfig, 'hipchat.authToken') && get(rcConfig, 'hipchat.roomToken') && get(rcConfig, 'hipchat.roomName')) {
        HipchatOps.notifyRoom({
            pkg,
            releaseInfo,
            rcConfig
        });
    } else {
        console.log(generateUnsetError('HipChat'));
    }
    /* eslint-enable no-console */

    return releaseInfo;
};

module.exports = {
    getPrereleaseVersion,
    release,
    calculateReleaseInfo,
    calculateReleaseFromGitLogs,
    writeChangelog,
    publishReleaseToGitHub
};
