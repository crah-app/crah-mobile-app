import BuildCharacterUI from '@/components/Character/BuildCharacterUI';
import RenderCharacter from '@/components/Character/RenderCharacter';
import ActionContainer from '@/components/createProfile/ActionContainer';
import SearchBar from '@/components/general/SearchBar';
import ThemedText from '@/components/general/ThemedText';
import ThemedTextInput from '@/components/general/ThemedTextInput';
import GetSVG from '@/components/GetSVG';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import ProgressionBar from '@/components/ProgressionBar';
import Tag from '@/components/tag';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useCommonTricks } from '@/hooks/getCommonTricks';
import { TextInputMaxCharacters, Trick } from '@/types';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	Alert,
	Dimensions,
	KeyboardAvoidingView,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

/*
Initial Page
*/

const CreateProfile = () => {
	const theme = useSystemTheme();
	const { bottom } = useSafeAreaInsets();

	const totalSteps = 5;

	const [stepsComplete, setStepsComplete] = useState<number>(0);
	const [currentStep, setCurrentStep] = useState<number>(0);

	// page data
	const [username, setUsername] = useState<string>('');
	const [selectedBestTricks, setSelectedBestTricks] = useState<Trick[]>([]);

	const [trickSearchQuery, setTrickSearchQuery] = useState<string>('');
	const [showWarningToWriteName, setShowWarningToWriteName] =
		useState<boolean>(false);

	const { commonTricks, loading, error } = useCommonTricks();

	const allowedToContinueHandler = () => {
		switch (currentStep) {
			case 1: // second page
				if (username.length <= 0) {
					setShowWarningToWriteName(true);
					return false;
				}
				break;

			case 2: // third page
				if (selectedBestTricks.length <= 0) return true;
				break;
		}

		return true;
	};

	const handleContinue = () => {
		const result = allowedToContinueHandler();

		if (!result) return false;

		setStepsComplete((prev) => {
			if (prev < 5) {
				setCurrentStep(prev + 1);
				return prev + 1;
			}

			return prev;
		});
	};

	const handleGoBack = () => {
		setStepsComplete((prev) => {
			if (prev > 0) {
				setCurrentStep(prev - 1);
				return prev - 1;
			}

			return prev;
		});
	};

	return (
		<HeaderScrollView
			headerChildren={
				<CostumHeader
					theme={theme}
					headerLeft={<HeaderLeftLogo />}
					headerRight={
						<TouchableOpacity>
							<Ionicons
								name="help-circle-outline"
								size={32}
								color={Colors[theme].textPrimary}
							/>
						</TouchableOpacity>
					}
					headerBottom={
						<View
							style={[
								{
									paddingTop: 38,
									width: 300,
									gap: 8,
									alignItems: 'center',
								},
							]}>
							<ProgressionBar
								theme={theme}
								progress={stepsComplete}
								totalProgress={5}
							/>
						</View>
					}
				/>
			}
			scrollChildren={
				<View style={{ flex: 1, bottom: bottom * 3.5 }}>
					<StatusBar barStyle={'default'} />

					{/* main action text container */}
					<View
						style={{
							flex: 1,
							justifyContent: 'flex-start',
							alignItems: 'flex-start',
							top: bottom * 3.5 + 45,
						}}>
						{currentStep < 5 && (
							<ActionContainer
								currentStep={currentStep}
								commonTricks={commonTricks}
								error={error}
								loading={loading}
								theme={theme}
								username={username}
								setUsername={setUsername}
								showWarningToWriteName={showWarningToWriteName}
								setShowWarningToWriteName={setShowWarningToWriteName}
								trickSearchQuery={trickSearchQuery}
								setTrickSearchQuery={setTrickSearchQuery}
								bottom={bottom}
							/>
						)}

						<BuildCharacterUI visible={currentStep === 5} />
					</View>

					{/* bottom action container */}

					<View
						style={{
							alignItems: 'center',
							gap: 10,
						}}>
						{currentStep < 5 && (
							<TouchableOpacity
								onPress={handleContinue}
								style={[
									{
										width: 250,
										padding: 8,
										backgroundColor: Colors[theme].primary,
										justifyContent: 'center',
										alignItems: 'center',
										borderRadius: 24,
									},
								]}>
								<ThemedText
									theme={theme}
									value={'Continue'}
									style={[{ fontSize: 18, fontWeight: '700' }]}
								/>
							</TouchableOpacity>
						)}
						<TouchableOpacity onPress={handleGoBack}>
							<ThemedText
								theme={theme}
								value={'Go Back'}
								style={[{ fontSize: 14 }]}
							/>
						</TouchableOpacity>
					</View>
				</View>
			}
			theme={theme}
		/>
	);
};

const styles = StyleSheet.create({
	pageContainer: {
		paddingHorizontal: 8,
		flex: 1,
		width: '100%',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	smallText: {
		textAlign: 'center',
		fontSize: 17,
	},
	webview: {
		flex: 1,
	},
});

export default CreateProfile;
