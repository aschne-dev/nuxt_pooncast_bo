export const BO_AUTHORIZATION_STATUS = Object.freeze({
  IDLE: 'idle',
  ANONYMOUS: 'anonymous',
  CHECKING: 'checking',
  AUTHORIZED: 'authorized',
  UNAUTHORIZED: 'unauthorized',
  ERROR: 'error',
});

export function createBackOfficeAuthorizationController({
  readState,
  writeState,
  readBackOfficeUser,
  signOutUser,
}) {
  const clear = (status = BO_AUTHORIZATION_STATUS.IDLE) => {
    writeState({ status, uid: null, profile: null });
  };

  const deny = async (status) => {
    clear(status);
    try {
      await signOutUser();
    } catch (_error) {
      // Authorization remains denied even when Firebase sign-out fails.
    }
    return false;
  };

  const authorize = async (user, options = {}) => {
    if (!user?.uid) {
      clear(BO_AUTHORIZATION_STATUS.ANONYMOUS);
      return false;
    }

    const current = readState();
    if (
      !options.force &&
      current.status === BO_AUTHORIZATION_STATUS.AUTHORIZED &&
      current.uid === user.uid
    ) {
      return true;
    }

    clear(BO_AUTHORIZATION_STATUS.CHECKING);
    try {
      const profile = await readBackOfficeUser(user.uid);
      if (!profile) return deny(BO_AUTHORIZATION_STATUS.UNAUTHORIZED);
      writeState({
        status: BO_AUTHORIZATION_STATUS.AUTHORIZED,
        uid: user.uid,
        profile,
      });
      return true;
    } catch (_error) {
      return deny(BO_AUTHORIZATION_STATUS.ERROR);
    }
  };

  const logout = async () => {
    clear();
    await signOutUser();
  };

  return { authorize, clear, logout };
}
