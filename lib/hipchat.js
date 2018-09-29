const isEmpty = require('lodash/isEmpty');
const Hipchatter = require('hipchatter');

const notifyRoom = ({pkg, releaseInfo, rcConfig}) => {
    const {
        repository,
        name,
        description,
        isPublic,
    } = pkg;
    const {
        hipchat: {
            apiRoot,
            authToken,
            roomToken,
            roomName
        }
    } = rcConfig;
    const apiUrl = (!isEmpty(apiRoot)) ? apiRoot : null;
    const hc = new Hipchatter(authToken, apiUrl);
    const changelogUrl = `${repository}/blob/master/CHANGELOG.md`;

    hc
        .notify(roomName,
            {
                token: roomToken,
                notify: true,
                message: `
                    @here A new version of <a href="${repository}">${name}</a> was published as a ${(isPublic) ? 'public' : 'private'} package to npm.<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Version: ${releaseInfo.version}</strong><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${description}<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="${changelogUrl}">View Changelog</a>
                `,
            },
            error => {
                if (error) {
                    console.log('Error notifying HipChat.'); // eslint-disable-line no-console
                } else {
                    console.log(`Notified HipChat of publish to npm.`); // eslint-disable-line no-console
                }
            });
};

module.exports = {
    notifyRoom
};
