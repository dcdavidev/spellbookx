import { packageJson } from './helpers.js';

const peerDependencies = Object.keys(packageJson.peerDependencies || {});

export const globalDependencies = ['commitizen', 'cz-git'];

export const dependencies = [packageJson.name, ...peerDependencies];
