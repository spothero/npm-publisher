const {WebClient} = require('@slack/web-api');

const notifyChannel = ({pkg, releaseInfo, rcConfig}) => {
    const {
        repository,
        name,
        description,
        isPublic,
    } = pkg;
    const {
        slack: {
            channelId,
            botUserToken
        }
    } = rcConfig;
    const web = new WebClient(botUserToken);
    const changelogUrl = `${repository}/blob/master/CHANGELOG.md`;

    web
        .chat
        .postMessage({
            channel: channelId,
            text: `<!here> A new version of <${repository}|${name}> was published as a ${(isPublic) ? 'public' : 'private'} package to npm.`,
            attachments: [
                {
                    pretext: description,
                    fallback: `View the Changelog at ${changelogUrl}.`,
                    color: '#0082ff',
                    author_name: `v${releaseInfo.version}`, // eslint-disable-line camelcase
                    actions: [
                        {
                            type: 'button',
                            text: 'View Changelog',
                            url: changelogUrl,
                            style: 'primary'
                        }
                    ]
                }
            ],
            unfurl_links: false // eslint-disable-line camelcase
        })
        .then(res => {
            console.log(`Notified Slack of publish to npm.`); // eslint-disable-line no-console
        })
        .catch(err => {
            console.log('Error notifying Slack.'); // eslint-disable-line no-console
        });
};

module.exports = {
    notifyChannel
};
