import { packageJson } from './helpers.js';

const peerDependencies = Object.keys(packageJson.peerDependencies || {});

export const globalDependencies = ['eslint'];

export const dependencies = [packageJson.name, ...peerDependencies];
