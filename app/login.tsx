import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { Link, router, Stack } from 'expo-router';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '@/components/ThemedText';

import { defaultStyles } from '@/constants/Styles';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { useLocalSearchParams } from 'expo-router';
import ThemedView from '@/components/ThemedView';

import TitleImage from '../assets/images/vectors/flyinghenke.svg';
import TitleImageDark from '../assets/images/vectors/flyinghenke_dark.svg';

import { SvgXml } from 'react-native-svg';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;

const Page = () => {
  const theme = useSystemTheme();
  const { type } = useLocalSearchParams<{ type: string }>();
  const { signIn, setActive, isLoaded } = useSignIn();
  const {
    signUp,
    isLoaded: signUpLoaded,
    setActive: signupSetActive,
  } = useSignUp();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [resetCode, setResetCode] = useState('');
  const [code, setCode] = useState('');
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });
  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });

  const onSignUpPress = async () => {
    if (!signUpLoaded) return;
    setLoading(true);

    try {
      await signUp.create({
        emailAddress,
        password,
        username,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!signUpLoaded || !isLoaded) return;
    setLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/(auth)/profile');
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  }, [isLoaded, emailAddress, password]);

  const onResetPasswordPress = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);

      // await signIn.prepareEmailAddressVerification({
      //   strategy: 'email_code',
      // });

      // setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const onActualPasswordReset = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: resetCode,
        password: newPassword,
      });
      console.log(result);
      alert('Password reset successfully');

      // Set the user session active, which will log in the user automatically
      await setActive({ session: result.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView flex={1} theme={theme}>
      {loading && (
        <View style={defaultStyles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color={theme == 'dark' ? '#fff' : '000'}
          />
        </View>
      )}
      <ScrollView keyboardDismissMode="interactive">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={70}
          style={styles.container}
        >
          {type !== 'google' ? (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {theme == `light` ? (
                <SvgXml width="250" height="250" xml={TitleImageDark} />
              ) : (
                <SvgXml width="250" height="250" xml={TitleImage} />
              )}
            </View>
          ) : (
            <View />
          )}

          <ThemedText
            theme={theme}
            style={[styles.title]}
            value={
              type === 'login' && pendingVerification === false
                ? 'Welcome back'
                : type === 'register' && pendingVerification === false
                ? 'Create new account'
                : pendingVerification === true
                ? 'Verify your Email'
                : 'Reset Password'
            }
          />

          {!pendingVerification && !successfulCreation && (
            <ThemedView theme={theme} style={{ marginBottom: 0 }}>
              <TextInput
                autoCapitalize="none"
                placeholder="your email"
                value={emailAddress}
                onChangeText={setEmailAddress}
                style={[
                  styles.inputField,
                  {
                    backgroundColor: Colors[theme].surface,
                    color: Colors[theme].textPrimary,
                    borderColor: Colors[theme].borderColor,
                  },
                ]}
              />

              {type !== 'forgot' && !successfulCreation && (
                <TextInput
                  placeholder={'password'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={[
                    styles.inputField,
                    {
                      backgroundColor: Colors[theme].surface,
                      color: Colors[theme].textPrimary,
                      borderColor: Colors[theme].borderColor,
                    },
                  ]}
                />
              )}

              {type === 'register' && (
                <TextInput
                  placeholder="set a username"
                  value={username}
                  onChangeText={setUsername}
                  style={[
                    styles.inputField,
                    {
                      backgroundColor: Colors[theme].surface,
                      color: Colors[theme].textPrimary,
                      borderColor: Colors[theme].borderColor,
                    },
                  ]}
                />
              )}
            </ThemedView>
          )}

          {type === 'forgot' && successfulCreation && (
            <View>
              <TextInput
                value={resetCode}
                placeholder="Code..."
                style={styles.inputField}
                onChangeText={setResetCode}
              />
              <TextInput
                placeholder="New password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                style={styles.inputField}
              />
            </View>
          )}

          {type === 'login' && pendingVerification === false ? (
            <View>
              <Link
                href={{ pathname: '/login', params: { type: 'forgot' } }}
                asChild
                style={[defaultStyles.btn, styles.btnPrimary]}
              >
                <TouchableOpacity>
                  <ThemedText
                    style={styles.btnPrimaryText}
                    theme={theme}
                    value={'I forgot my Password'}
                  />
                </TouchableOpacity>
              </Link>
              <TouchableOpacity
                style={[defaultStyles.btn, styles.btnPrimary]}
                onPress={onSignInPress}
              >
                <ThemedText
                  style={styles.btnPrimaryText}
                  theme={theme}
                  value={'Log In'}
                />
              </TouchableOpacity>
            </View>
          ) : type === 'register' && pendingVerification === false ? (
            <TouchableOpacity
              style={[defaultStyles.btn, styles.btnPrimary]}
              onPress={onSignUpPress}
            >
              <ThemedText
                style={styles.btnPrimaryText}
                theme={theme}
                value={'Create'}
              />
            </TouchableOpacity>
          ) : pendingVerification ? (
            <KeyboardAvoidingView
              style={[
                styles.container,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  width: '100%',
                  height: 180,
                },
              ]}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={10}
            >
              <CodeField
                ref={ref}
                {...props}
                value={code}
                onChangeText={setCode}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <ThemedText
                    theme={theme}
                    key={index}
                    style={[
                      styles.cellRoot,
                      {
                        borderColor: Colors[theme].borderColor,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        flex: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        padding: 12.5,
                      },
                      styles.cellText,
                      isFocused && { backgroundColor: Colors[theme].surface },
                    ]}
                    onLayout={getCellOnLayoutHandler(index)}
                    value={symbol || (isFocused ? <Cursor /> : '')}
                  />
                )}
              />

              <TouchableOpacity
                onPress={onVerifyPress}
                style={[defaultStyles.btn, styles.btnPrimary, { flex: 1 }]}
              >
                <ThemedText
                  value="Verify"
                  theme={theme}
                  style={{ marginTop: 0 }}
                />
              </TouchableOpacity>
            </KeyboardAvoidingView>
          ) : type === 'forgot' ? (
            <View>
              {!successfulCreation ? (
                <View>
                  <Link
                    href={{ pathname: '/login', params: { type: 'login' } }}
                    asChild
                    style={[defaultStyles.btn, styles.btnPrimary]}
                  >
                    <TouchableOpacity>
                      <ThemedText
                        style={styles.btnPrimaryText}
                        theme={theme}
                        value={'Go back to login'}
                      />
                    </TouchableOpacity>
                  </Link>

                  <TouchableOpacity
                    onPress={onResetPasswordPress}
                    style={[defaultStyles.btn, styles.btnPrimary, { flex: 1 }]}
                  >
                    <ThemedText
                      value="Send Email Code"
                      theme={theme}
                      style={{ marginTop: 0 }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TouchableOpacity
                    onPress={onActualPasswordReset}
                    style={[defaultStyles.btn, styles.btnPrimary, { flex: 1 }]}
                  >
                    <ThemedText
                      value="Set new Password"
                      theme={theme}
                      style={{ marginTop: 0 }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <Cursor />
          )}
        </KeyboardAvoidingView>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginVertical: 80,
  },
  title: {
    fontSize: 35,
    marginBottom: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors['default'].borderColor,
    borderRadius: 12,
    padding: 10,
  },
  btnPrimary: {
    // marginVertical: 4,
  },
  btnPrimaryText: {
    fontSize: 16,
  },
  codeFieldRoot: {
    gap: 6,
  },
  cellRoot: {
    flex: 1,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  cellText: {
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  focusCell: {
    paddingBottom: 4,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default Page;