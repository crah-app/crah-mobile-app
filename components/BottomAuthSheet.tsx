import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
import { defaultStyles } from '@/constants/Styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { AuthStrategy } from '@/types';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { createMiniHash } from '@/constants/Methods';

const BottomAuthSheet = () => {
  useWarmUpBrowser();

  const { bottom } = useSafeAreaInsets();
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();

  const { startOAuthFlow: googleAuth } = useOAuth({
    strategy: AuthStrategy.Google,
  });

  const onSelectAuth = async (strategy: AuthStrategy) => {
    if (!signIn || !signUp) return null;

    const selectedAuth = {
      [AuthStrategy.Google]: googleAuth,
    }[strategy];

    // https://clerk.com/docs/custom-flows/oauth-connections#o-auth-account-transfer-flows
    // If the user has an account in your application, but does not yet
    // have an OAuth account connected to it, you can transfer the OAuth
    // account to the existing user account.
    const userExistsButNeedsToSignIn =
      signUp.verifications.externalAccount.status === 'transferable' &&
      signUp.verifications.externalAccount.error?.code ===
        'external_account_exists';

    if (userExistsButNeedsToSignIn) {
      const res = await signIn.create({ transfer: true });

      if (res.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        });
      }
    }

    const userNeedsToBeCreated =
      signIn.firstFactorVerification.status === 'transferable';

    if (userNeedsToBeCreated) {
      const res = await signUp.create({
        transfer: true,
        username: `UserX`, // does not work for some reason. Btw. In the clerk config you have to disable the requirement for a username to set OAuth to work
      });

      if (res.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        });
      }
    } else {
      // If the user has an account in your application
      // and has an OAuth account connected to it, you can sign them in.
      try {
        const { createdSessionId, setActive } = await selectedAuth();

        if (createdSessionId) {
          setActive!({ session: createdSessionId });
          console.log('OAuth success standard');
        }
      } catch (err) {
        console.error('OAuth error', err);
      }
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <View style={[styles.wrapper]}>
        <TouchableOpacity
          onPress={() => onSelectAuth(AuthStrategy.Google)}
          style={[styles.authColumn, defaultStyles.btn]}
        >
          <Ionicons
            name="logo-google"
            color={Colors.light.textPrimary}
            size={22}
            style={[styles.btnIcon]}
          />
          <Text style={[styles.columnText]}>Sign In with Google</Text>
        </TouchableOpacity>

        <Link
          href={{
            params: { type: 'login' },
            pathname: '/login',
          }}
          asChild
          style={[styles.authColumn, defaultStyles.btn]}
        >
          <TouchableOpacity>
            <Ionicons
              name="log-in-outline"
              color={Colors.light.textPrimary}
              size={22}
              style={[styles.btnIcon]}
            />
            <Text style={[styles.columnText]}>I have an Account</Text>
          </TouchableOpacity>
        </Link>

        <Link
          href={{
            params: { type: 'register' },
            pathname: '/login',
          }}
          asChild
          style={[styles.authColumn, defaultStyles.btn]}
        >
          <TouchableOpacity>
            <Text style={[styles.columnText]}>Create new Account</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#000',
    height: 270,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  wrapper: {
    paddingTop: 35,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 16,
  },
  authColumn: {
    backgroundColor: Colors.dark.buttonDefault,
    color: Colors.dark.textPrimary,
    width: '85%',
  },
  columnText: {
    fontSize: 17,
    fontWeight: '400',
  },
  btnIcon: {
    paddingRight: 6,
  },
});

export default BottomAuthSheet;
