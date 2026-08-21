import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  BO_AUTHORIZATION_STATUS,
  createBackOfficeAuthorizationController,
} from '~/utils/bo-authorization';

export function useBoAuthorization() {
  const auth = useFirebaseAuth();
  const firestore = useFirestore();
  const authorizationStatus = useState(
    'bo-authorization-status',
    () => BO_AUTHORIZATION_STATUS.IDLE
  );
  const authorizedUid = useState('bo-authorized-uid', () => null);
  const authorizationProfile = useState('bo-authorization-profile', () => null);

  const controller = createBackOfficeAuthorizationController({
    readState: () => ({
      status: authorizationStatus.value,
      uid: authorizedUid.value,
      profile: authorizationProfile.value,
    }),
    writeState: (state) => {
      authorizationStatus.value = state.status;
      authorizedUid.value = state.uid;
      authorizationProfile.value = state.profile;
    },
    readBackOfficeUser: async (uid) => {
      const snapshot = await getDoc(doc(firestore, 'bo_users', uid));
      return snapshot.exists() ? snapshot.data() : null;
    },
    signOutUser: async () => {
      if (auth) await signOut(auth);
    },
  });

  return {
    authorizationStatus,
    authorizationProfile,
    authorizeBackOfficeUser: controller.authorize,
    clearAuthorization: controller.clear,
    logoutBackOfficeUser: controller.logout,
  };
}
