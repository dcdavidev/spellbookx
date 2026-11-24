import { describe, expect, it } from 'vitest';

import {
  buildLefthookConfig,
  lefthookConfigTemplate,
  type LefthookOptions,
} from '../src/lib/lefthook.js';

const options: LefthookOptions = {
  packageManager: 'pnpm',
  selectedTools: ['eslint', 'prettier', 'commitlint'],
  commitlintLocation: 'config-dir',
};

describe('spellbookx (lefthook)', () => {
  it('runs ESLint then Prettier on staged files, and commitlint with --config', () => {
    const config = buildLefthookConfig(options);

    expect(config['pre-commit']).toEqual({
      piped: true,
      jobs: [
        {
          name: 'eslint',
          run: 'pnpm exec eslint --no-warn-ignored --fix {staged_files}',
          stage_fixed: true,
        },
        {
          name: 'prettier',
          run: 'pnpm exec prettier --ignore-unknown --write {staged_files}',
          stage_fixed: true,
        },
      ],
    });
    expect(config['commit-msg']?.jobs[0]?.run).toBe(
      'pnpm exec commitlint --config ./.config/commitlint.mjs --edit {1}'
    );
  });

  it('omits --config when commitlint.config.mjs is in the root', () => {
    const config = buildLefthookConfig({
      ...options,
      commitlintLocation: 'root',
    });

    expect(config['commit-msg']?.jobs[0]?.run).toBe(
      'pnpm exec commitlint --edit {1}'
    );
  });

  it('writes only the hooks of the selected tools', () => {
    const config = buildLefthookConfig({
      ...options,
      selectedTools: ['commitlint'],
    });

    expect(config['pre-commit']).toBeUndefined();
    expect(config['commit-msg']).toBeDefined();
  });

  it('serializes the same hooks as YAML, JSON, and TOML', () => {
    const yaml = lefthookConfigTemplate('yaml', options);
    expect(yaml).toContain('pre-commit:\n  piped: true\n  jobs:\n');
    expect(yaml).toContain(
      "    - name: 'commitlint'\n      run: 'pnpm exec commitlint --config ./.config/commitlint.mjs --edit {1}'"
    );

    const json = JSON.parse(lefthookConfigTemplate('json', options));
    expect(json).toEqual(buildLefthookConfig(options));

    const toml = lefthookConfigTemplate('toml', options);
    expect(toml).toContain('[pre-commit]\npiped = true');
    expect(toml).toContain('[[pre-commit.jobs]]\nname = "eslint"');
    expect(toml).toContain(
      String.raw`fail_text = "Use Conventional Commits, for example \"feat: add a page\"."`
    );
  });
});
