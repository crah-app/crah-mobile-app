import {
	Dimensions,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import CostumHeader from '@/components/header/CostumHeader';
import { Ionicons } from '@expo/vector-icons';
import { defaultHeaderBtnSize, defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import ThemedText from '@/components/general/ThemedText';
import ThemedView from '@/components/general/ThemedView';
import UserImageCircle from '@/components/general/UserImageCircle';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import PostTypeButton from '@/components/PostTypeButton';
import { TextInputMaxCharacters } from '@/types';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import {
	KeyboardAvoidingView,
	KeyboardAwareScrollView,
	KeyboardProvider,
	KeyboardToolbar,
} from 'react-native-keyboard-controller';

const editProfile = () => {
	const theme = useSystemTheme();
	const router = useRouter();
	const { user } = useUser();

	const [username, setUsername] = useState('');
	const [displayName, setDisplayName] = useState('');
	const [description, setDescription] = useState('');

	useEffect(() => {
		setUsername(user?.username || '');
	}, [user]);

	interface Fields {
		name: string;
		secondary: string;
		value: string;
		setValue: Dispatch<SetStateAction<string>>;
	}

	const fields: Fields[] = useMemo(
		() => [
			{
				name: 'Username',
				secondary: '',
				value: username,
				setValue: setUsername,
			},
			{
				name: 'Display Name',
				secondary: '',
				value: displayName,
				setValue: setDisplayName,
			},
			{
				name: 'Description',
				secondary: `(Max. ${TextInputMaxCharacters.SmallDescription})`,
				value: description,
				setValue: setDescription,
			},
		],
		[username, displayName, description],
	);

	const ProfilePreview = useCallback(() => {
		return (
			<View style={{ height: '17.5%' }}>
				<ThemedView
					flex={1}
					theme={theme}
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: Colors[theme].background2,
					}}>
					{/* left side */}
					<View
						style={{
							paddingLeft: 12,
							flexDirection: 'row',
							gap: 16,
						}}>
						{/* user image */}
						<UserImageCircle
							width={88}
							height={88}
							imageUri={JSON.stringify(user?.imageUrl)}
						/>

						{/* username */}
						<View
							style={{
								flexDirection: 'column',
								gap: 4,
								alignItems: 'flex-start',
								justifyContent: 'center',
							}}>
							<ThemedText
								style={[
									defaultStyles.biggerText,
									{
										fontWeight: 600,
									},
								]}
								value={'Display Name'}
								theme={theme}
							/>

							<ThemedText
								style={[{ color: Colors[theme].textSecondary }]}
								value={user?.username || 'username'}
								theme={theme}
							/>
						</View>
					</View>

					{/* right side */}
					<View
						style={{
							marginLeft: 34,
							flex: 1,
							height: '100%',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						{/* rank badge */}
						<Ionicons
							name="american-football-outline"
							size={42}
							color={Colors[theme].textPrimary}
						/>
					</View>
				</ThemedView>
			</View>
		);
	}, [theme, user]);

	const SettingsButtons = useCallback(() => {
		return (
			<View style={{ height: '15%' }}>
				<ThemedView
					theme={theme}
					flex={1}
					style={{
						marginTop: 12,
						marginHorizontal: 12,
						gap: 12,
						flexWrap: 'wrap',
						alignItems: 'center',
						flexDirection: 'row',
						justifyContent: 'center',
					}}>
					<PostTypeButton val={'Best Tricks'} click_action={() => {}} />
					<PostTypeButton val={'Picture'} click_action={() => {}} />
					<PostTypeButton val={'Aura'} click_action={() => {}} />
				</ThemedView>
			</View>
		);
	}, [theme]);

	const InputField = useCallback(
		({ name, secondary, setValue, value }: Fields) => {
			return (
				<View
					style={{
						flexDirection: 'column',
						gap: 12,
						justifyContent: 'flex-start',
						alignItems: 'flex-start',
					}}>
					<View
						style={[
							{
								flexDirection: 'row',
								gap: 12,
								alignItems: 'flex-end',
								justifyContent: 'flex-end',
							},
						]}>
						<ThemedText
							style={[defaultStyles.biggerText]}
							value={name}
							theme={theme}
						/>

						<ThemedText
							style={[
								{
									color: Colors[theme].textSecondary,
								},
							]}
							value={secondary}
							theme={theme}
						/>
					</View>

					<View>
						<ThemedTextInput
							multiline={secondary.length > 0 ? true : false}
							lines={secondary.length > 0 ? 10 : 1}
							outerContainerStyle={{
								width: Dimensions.get('window').width - 36,
							}}
							placeholder={name}
							setValue={setValue}
							value={value}
							theme={theme}
							maxLength={
								secondary.length > 0
									? TextInputMaxCharacters.SmallDescription
									: TextInputMaxCharacters.UserName
							}
						/>
					</View>
				</View>
			);
		},
		[theme],
	);

	const DisplayInfoInputs = useCallback(() => {
		return (
			<View style={{ flex: 1, marginHorizontal: 18, marginTop: 16 }}>
				{/* header */}
				<View
					style={{
						marginHorizontal: 12,
						paddingBottom: 12,
						borderBottomWidth: 2,
						borderBottomColor: Colors[theme].gray,
					}}>
					<ThemedText
						style={[defaultStyles.biggerText]}
						value={'Display Info'}
						theme={theme}
					/>
				</View>

				{/* input buttons */}
				<View style={{ marginTop: 24, gap: 24 }}>
					{fields.map((props) => (
						<InputField key={props.name} {...props} />
					))}
				</View>
			</View>
		);
	}, [fields, theme, InputField]);

	return (
		<HeaderScrollView
			scrollChildren={
				<>
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : undefined}
						style={{ flex: 1 }}>
						{/* keyboard aware scroll view */}
						<KeyboardAwareScrollView
							accessibilityViewIsModal={true}
							scrollEnabled={true}
							bottomOffset={100}
							contentContainerStyle={{ gap: 0, paddingBottom: 100 }}
							style={{ flex: 1 }}>
							{/* content */}
							<ThemedView flex={1} theme={theme} style={{ gap: 24 }}>
								<ProfilePreview />
								<SettingsButtons />
								<DisplayInfoInputs />
							</ThemedView>

							{/*  */}
						</KeyboardAwareScrollView>

						{/* tool bar */}
						<KeyboardToolbar />
					</KeyboardAvoidingView>
				</>
			}
			theme={theme}
			headerChildren={
				<CostumHeader
					theme={theme}
					headerCenter={
						<ThemedText
							style={[
								defaultStyles.biggerText,
								{ color: Colors[theme].textSecondary },
							]}
							value={'Edit Profile'}
							theme={theme}
						/>
					}
					headerLeft={
						<TouchableOpacity onPress={router.back}>
							<Ionicons
								name="arrow-back-outline"
								size={defaultHeaderBtnSize}
								color={Colors[theme].textSecondary}
							/>
						</TouchableOpacity>
					}
					headerRight={
						<TouchableOpacity
							onPress={() => router.replace('/(auth)/(tabs)/profilePages')}>
							<Ionicons
								style={{ fontWeight: '700' }}
								name="checkmark"
								size={defaultHeaderBtnSize}
								color={Colors[theme].primary}
							/>
						</TouchableOpacity>
					}
				/>
			}
		/>
	);
};

export default editProfile;

const styles = StyleSheet.create({});
