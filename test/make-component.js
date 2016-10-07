'use strict';
/* eslint-disable no-unused-expressions */

const MakeComponent = require('../make-component');
const path = require('path');
const fs = require('fs');
const nutil = require('nami-utils').file;
const chai = require('chai');
const expect = chai.expect;
const helpers = require('blacksmith-test');

describe('MakeComponent', () => {
  let metadata = {};
  let makeComponent = null;
  let testEnv = null;
  let dummyBE = null;
  let sampleDir = '';

  beforeEach('configure metadata', () => {
    metadata = {
      'id': 'sample',
      'version': '1.0.0'
    };
    helpers.cleanTestEnv();
    testEnv = helpers.createTestEnv();
    dummyBE = helpers.getDummyBuildEnvironment({
      buildDir: testEnv.buildDir,
      prefix: testEnv.prefix,
      sandbox: testEnv.sandbox
    });
    makeComponent = new MakeComponent(metadata);
    makeComponent.setup({be: dummyBE}, null);
    makeComponent.logger = helpers.getDummyLogger();
    sampleDir = path.join(testEnv.sandbox, 'sample-1.0.0');
    fs.mkdirSync(sampleDir);
  });

  afterEach('clean environment', () => {
    helpers.cleanTestEnv();
  });

  describe('MakeComponent~make', () => {
    beforeEach('copy Makefile into sampleDir', () => {
      nutil.copy(path.join(__dirname, 'fixtures', 'Makefile'), sampleDir);
    });

    it('"make" method without argument should execute the first command', () => {
      expect(makeComponent.make({logger: null})).to.be.match(/.*this is a test.*/);
    });

    it('"make" method should execute the command passed as arguments', () => {
      expect(makeComponent.make('test', 'install', {logger: null})).
      to.be.match(/.*this is a test.*\n*.*this is an installation.*/);
    });

    it('"install" method should execute the install command of the Makefile', () => {
      expect(makeComponent.install()).to.be.match(/.*this is an installation.*/);
    });
  });

  describe('MakeComponent~configure', () => {
    it('"configureOptions" method should return empty', () => {
      expect(makeComponent.configureOptions()).to.be.empty;
    });

    it('"configure" method should execute the configure script', () => {
      nutil.copy(path.join(__dirname, 'fixtures', 'configure'), sampleDir);
      expect(makeComponent.configure({logger: null})).to.be.match(/.*configure.*/);
    });
  });

  describe('MakeComponent~build', () => {
    it('"build" method should not throw error', () => {
      ['Makefile', 'configure'].forEach(f => nutil.copy(path.join(__dirname, 'fixtures', f), sampleDir));
      expect(() => makeComponent.build()).to.not.throw();
    });
  });
});
