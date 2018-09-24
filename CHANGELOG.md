# 2.0.0 - 09/24/2018
## Breaking Changes
* [[a405663](https://github.com/spothero/npm-publisher/commit/a405663)] - Added use of rc files for configuration of secret tokens (Matt Przybylski)

## New Features
* [[fbc7e24](https://github.com/spothero/npm-publisher/commit/fbc7e24)] - Updated how prereleases are created to support running a release with multiple commands in an npm script better (Matt Przybylski)

## Miscellaneous Updates
* [[22e5afd](https://github.com/spothero/npm-publisher/commit/22e5afd)] - `docs:` Small edit to url for logging in to npm organization (Matt Przybylski)
* [[511064d](https://github.com/spothero/npm-publisher/commit/511064d)] - `docs:` Add information on logging in to npm organization (Matt Przybylski)

# 1.0.0 - 08/28/2018
## Breaking Changes
* [[b6eb2dc](https://github.com/spothero/npm-publisher/commit/b6eb2dc)] - Moved away from Nexus to support publishing private packages to an npm organization (Matt Przybylski)

## Miscellaneous Updates
* [[874bd61](https://github.com/spothero/npm-publisher/commit/874bd61)] - `docs:` Clean up CHANGELOG (Matt Przybylski)

# 0.1.0 - 08/08/2018
## New Features
* [[b7f7261](https://github.com/spothero/npm-publisher/commit/b7f7261)] - Parsing Pull Requests ([#3](https://github.com/spothero/npm-publisher/pull/3)) (Matt Przybylski)
	* `feat:` Added ability to read the description of a PR to include them in the Changelog generation
	* `feat:` Added ability to pass prerelease information to a publish
	* `docs:` Updated README to show handling of pull request commits

## Miscellaneous Updates
* [[1bb0f95](https://github.com/spothero/npm-publisher/commit/1bb0f95)] - `fix:` Remove bug causing Nexus publishes to not have correct tag information (Matt Przybylski)
* [[4571516](https://github.com/spothero/npm-publisher/commit/4571516)] - `chore:` Upgrade to latest eslint-config to remove more false positives after updating ESLint (Matt Przybylski)
* [[dd0e416](https://github.com/spothero/npm-publisher/commit/dd0e416)] - `chore:` Bump eslint-config to latest to remove false positives (Matt Przybylski)
* [[482f63a](https://github.com/spothero/npm-publisher/commit/482f63a)] - `chore:` Bump commitlint version to allow longer commit messages (Matt Przybylski)

# 0.0.5 - 07/22/2018
## Miscellaneous Updates
* [[b47e7cb](https://github.com/spothero/npm-publisher/commit/b47e7cb)] - `chore:` Updated to latest public spothero packages in devDependencies (Matt Przybylski)
* [[a4fff4a](https://github.com/spothero/npm-publisher/commit/a4fff4a)] - `fix:` Cleaned up slack publish message to display proper registry (Matt Przybylski)

# 0.0.4 - 07/21/2018
## Miscellaneous Updates
* [[a7dc629](https://github.com/spothero/npm-publisher/commit/a7dc629)] - `fix:` Added explicit --registry to publish command when publishing to npm (Matt Przybylski)

# 0.0.3 - 07/21/2018
## Miscellaneous Updates
* [[6620ea9](https://github.com/spothero/npm-publisher/commit/6620ea9)] - `fix:` Remove internal commitlint call and set as array of strings (Matt Przybylski)

# 0.0.2 - 07/21/2018
## Miscellaneous Updates
* [[d601249](https://github.com/spothero/npm-publisher/commit/d601249)] - `fix:` Fix name of CLI script (Matt Przybylski)

# 0.0.1 - 07/21/2018
## Miscellaneous Updates
* [[3fc617f](https://github.com/spothero/npm-publisher/commit/3fc617f)] - `build:` Updated package to publish to Nexus properly (Matt Przybylski)
* [[c50bbbb](https://github.com/spothero/npm-publisher/commit/c50bbbb)] - `chore:` Initial release (Matt Przybylski)
