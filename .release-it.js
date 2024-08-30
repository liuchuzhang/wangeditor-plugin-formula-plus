module.exports = {
  git: {
    tagName: 'v${version}',
    commitMessage: 'release: v${version}',
    requireCleanWorkingDir: false,
    requireBranch: 'main',
  },
  github: {
    release: true,
    releaseName: 'Release v${version}',
    releaseNotes(context) {
      return context.changelog.split('\n').slice(1).join('\n')
    },
  },
  hooks: {
    'before:init': ['git pull origin main', 'npm run test'],
  },
  npm: {
    publish: false,
  },
  prompt: {
    ghRelease: false,
    glRelease: false,
    publish: false,
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: 'angular',
      header: '# Changelog',
      infile: 'CHANGELOG.md',
    },
  },
}
