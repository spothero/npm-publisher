#!/usr/bin/env node
const ReleaseOps = require('../lib/release');

const prereleaseId = (process.env.NPM_PRERELEASE) ? process.env.NPM_PRERELEASE : null;
const branchName = (process.env.BRANCH_NAME) ? process.env.BRANCH : null;

ReleaseOps.release(prereleaseId, branchName);
