# 2.3.3-beta.9 - 11/13/2020

## Miscellaneous Updates
* [[79165c1](https://github.com/spothero/npm-publisher/commit/79165c1)] - `docs:` Update readme (Boiar Qin)

# 2.3.3-beta.8 - 11/13/2020

## Miscellaneous Updates
* [[aa6229a](https://github.com/spothero/npm-publisher/commit/aa6229a)] - `test:` And then I bumped again (Boiar Qin)
* [[9737448](https://github.com/spothero/npm-publisher/commit/9737448)] - `test:` And then I bumped again (Boiar Qin)
* [[149f423](https://github.com/spothero/npm-publisher/commit/149f423)] - `test:` Default to master (Boiar Qin)

# 2.3.3-beta.5 - 11/13/2020

## Miscellaneous Updates
* [[cd9098c](https://github.com/spothero/npm-publisher/commit/cd9098c)] - `test:` Test different git command (Boiar Qin)
* [[6aab862](https://github.com/spothero/npm-publisher/commit/6aab862)] - `test:` See if concourse grabs the tmp file (Boiar Qin)
* [[673c8ee](https://github.com/spothero/npm-publisher/commit/673c8ee)] - `test:` And then I bumped again (Boiar Qin)

# 2.3.2 - 09/03/2019

## Miscellaneous Updates
* [[42c387e](https://github.com/spothero/npm-publisher/commit/42c387e)] - `chore:` Update to latest dependencies to fix security vulnerabilities (Matt Przybylski)

# 2.3.1 - 07/05/2019

## Miscellaneous Updates
* [[99e5561](https://github.com/spothero/npm-publisher/commit/99e5561)] - `chore:` Update to latest dependencies (Matt Przybylski)

# 2.3.0 - 06/17/2019
## Dependency Updates
* [[0450be4](https://github.com/spothero/npm-publisher/commit/0450be4)] - Upgrade dependencies to get Axios updates, add Codeowners file (boiarqin)

# 2.2.1 - 05/08/2019

## Miscellaneous Updates
* [[d28917d](https://github.com/spothero/npm-publisher/commit/d28917d)] - `chore:` Update dependencies to latest to fix commitlint issue (Matt Przybylski)

# 2.2.0 - 04/08/2019
## Dependency Updates
* [[5bfcee9](https://github.com/spothero/npm-publisher/commit/5bfcee9)] - Dependencies to latest (Matt Przybylski)

# 2.1.4 - 03/11/2019

## Miscellaneous Updates
* [[6fc7ccb](https://github.com/spothero/npm-publisher/commit/6fc7ccb)] - `fix:` Add retrieving tags from remote before determining versions (Matt Przybylski)

# 2.1.3 - 02/28/2019
## Miscellaneous Updates
* [[37bbb5f](https://github.com/spothero/npm-publisher/commit/37bbb5f)] - `chore:` Update deps to latest (Matt Przybylski)

# 2.1.2 - 01/08/2019

## Miscellaneous Updates
* [[940828f](https://github.com/spothero/npm-publisher/commit/940828f)] - `chore:` Updated to latest deps (Matt Przybylski)
* [[95f59ac](https://github.com/spothero/npm-publisher/commit/95f59ac)] - `chore:` License under Apache 2.0 instead of MIT (Matt Przybylski)
* [[86de8d2](https://github.com/spothero/npm-publisher/commit/86de8d2)] - `docs:` Add note about properly storing .npmpublisherrc file in preferred home directory (Matt Przybylski)

# 2.1.1 - 10/15/2018

## Miscellaneous Updates
* [[b617a32](https://github.com/spothero/npm-publisher/commit/b617a32)] - `chore:` Upgrade to latest commitlint config and husky script format (Matt Przybylski)

# 2.1.0 - 09/29/2018
## New Features
* [[237b8a0](https://github.com/spothero/npm-publisher/commit/237b8a0)] - Added ability to push publish notifications to a HipChat room (Matt Przybylski)

## Dependency Updates
* [[916b551](https://github.com/spothero/npm-publisher/commit/916b551)] - Updated dependencies to latest (Matt Przybylski)

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
