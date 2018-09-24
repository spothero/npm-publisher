#!/usr/bin/env node
const ReleaseOps = require('../lib/release');

const prereleaseId = (process.env.NPM_PRERELEASE) ? process.env.NPM_PRERELEASE : null;

ReleaseOps.release(prereleaseId);
