import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import {
  BO_AUTHORIZATION_STATUS,
  createBackOfficeAuthorizationController,
} from '../utils/bo-authorization.js';

const middlewareSource = await readFile(new URL('../middleware/auth.global.ts', import.meta.url), 'utf8');
const loginSource = await readFile(new URL('../components/Login.vue', import.meta.url), 'utf8');
const navigationSource = await readFile(new URL('../components/NavBar.vue', import.meta.url), 'utf8');

function fixture(options = {}) {
  let state = { status: BO_AUTHORIZATION_STATUS.IDLE, uid: null, profile: null };
  let lookups = 0;
  let signOuts = 0;
  const controller = createBackOfficeAuthorizationController({
    readState: () => state,
    writeState: (next) => { state = next; },
    readBackOfficeUser: async (uid) => {
      lookups += 1;
      if (options.lookupError) throw new Error('lookup failed');
      return options.profiles?.[uid] || null;
    },
    signOutUser: async () => {
      signOuts += 1;
      if (options.signOutError) throw new Error('sign-out failed');
    },
  });
  return {
    controller,
    state: () => state,
    lookups: () => lookups,
    signOuts: () => signOuts,
  };
}

describe('back-office authorization', () => {
  it('redirects anonymous state without querying bo_users', async () => {
    const test = fixture();
    assert.equal(await test.controller.authorize(null), false);
    assert.equal(test.state().status, BO_AUTHORIZATION_STATUS.ANONYMOUS);
    assert.equal(test.lookups(), 0);
  });

  it('allows an authenticated user present in bo_users', async () => {
    const profile = { firstname: 'BO Test' };
    const test = fixture({ profiles: { 'bo-user': profile } });
    assert.equal(await test.controller.authorize({ uid: 'bo-user' }), true);
    assert.deepEqual(test.state(), {
      status: BO_AUTHORIZATION_STATUS.AUTHORIZED,
      uid: 'bo-user',
      profile,
    });
    assert.equal(test.signOuts(), 0);
  });

  it('denies and signs out an authenticated user absent from bo_users', async () => {
    const test = fixture();
    assert.equal(await test.controller.authorize({ uid: 'non-bo-user' }), false);
    assert.deepEqual(test.state(), {
      status: BO_AUTHORIZATION_STATUS.UNAUTHORIZED,
      uid: null,
      profile: null,
    });
    assert.equal(test.signOuts(), 1);
  });

  it('checks bo_users again when a session is restored in a fresh state', async () => {
    let lookups = 0;
    const createRestoredSession = () => {
      let state = { status: BO_AUTHORIZATION_STATUS.IDLE, uid: null, profile: null };
      return createBackOfficeAuthorizationController({
        readState: () => state,
        writeState: (next) => { state = next; },
        readBackOfficeUser: async () => { lookups += 1; return { firstname: 'BO Test' }; },
        signOutUser: async () => {},
      });
    };
    assert.equal(await createRestoredSession().authorize({ uid: 'bo-user' }), true);
    assert.equal(await createRestoredSession().authorize({ uid: 'bo-user' }), true);
    assert.equal(lookups, 2);
  });

  it('clears authorization state before logout', async () => {
    const test = fixture({ profiles: { 'bo-user': { firstname: 'BO Test' } } });
    await test.controller.authorize({ uid: 'bo-user' });
    await test.controller.logout();
    assert.deepEqual(test.state(), {
      status: BO_AUTHORIZATION_STATUS.IDLE,
      uid: null,
      profile: null,
    });
    assert.equal(test.signOuts(), 1);
  });

  it('fails closed when the bo_users lookup or sign-out fails', async () => {
    const test = fixture({ lookupError: true, signOutError: true });
    assert.equal(await test.controller.authorize({ uid: 'bo-user' }), false);
    assert.deepEqual(test.state(), {
      status: BO_AUTHORIZATION_STATUS.ERROR,
      uid: null,
      profile: null,
    });
    assert.equal(test.signOuts(), 1);
  });

  it('awaits authorization before login or middleware navigation can enter the BO', () => {
    assert.ok(
      middlewareSource.indexOf('await authorizeBackOfficeUser(user)') <
      middlewareSource.indexOf("navigateTo('/')")
    );
    assert.ok(
      loginSource.indexOf('await authorizeBackOfficeUser(credential.user') <
      loginSource.indexOf("await navigateTo('/')")
    );
    assert.match(loginSource, /if\s*\(!authorized\)[\s\S]*return;/u);
  });

  it('reuses the authorized profile instead of issuing a layout-level bo_users read', () => {
    assert.match(navigationSource, /authorizationProfile/u);
    assert.doesNotMatch(navigationSource, /getDoc|useFirestore/u);
  });
});
