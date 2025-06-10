import ThemedText from '@/components/general/ThemedText';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import ProgressionBar from '@/components/ProgressionBar';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
	Dimensions,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/*
Initial Page
*/

const CreateProfile = () => {
	const theme = useSystemTheme();
	const { bottom } = useSafeAreaInsets();

	const totalSteps = 5;

	const [stepsComplete, setStepsComplete] = useState<number>(0);
	const [currentStep, setCurrentStep] = useState<number>(0);

	const handleContinue = () => {
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

	const ActionContainer = () => {
		switch (currentStep) {
			case 0:
				return (
					<View
						style={{
							flex: 1,
							top: 250,
							justifyContent: 'flex-start',
							alignItems: 'center',
						}}>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								gap: 12,
							}}>
							<ThemedText
								style={[defaultStyles.bigText, { fontWeight: 500 }]}
								theme={theme}
								value={'Nice, that you are here!'}
							/>

							<ThemedText
								style={[
									{ color: Colors[theme].lightGray, textAlign: 'center' },
								]}
								theme={theme}
								value={
									'Blib Blab Blub. Blib Blab Blub.Blib Blab Blub.Blib Blab Blub.Blib Blab Blub.Blib Blab Blub.Blib Blab Blub.Blib Blab Blub.'
								}
							/>
						</View>
					</View>
				);

			case 1:
				return (
					<View
						style={{
							flex: 1,
							top: 250,
							justifyContent: 'flex-start',
							alignItems: 'center',
						}}>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								gap: 12,
							}}>
							<ThemedText
								style={[defaultStyles.bigText, { fontWeight: 500 }]}
								theme={theme}
								value={'Page 2'}
							/>

							<ThemedText
								style={[
									{ color: Colors[theme].lightGray, textAlign: 'center' },
								]}
								theme={theme}
								value={'This is the Next Page'}
							/>
						</View>
					</View>
				);

			case 2:
				return (
					<View
						style={{
							flex: 1,
							top: 250,
							justifyContent: 'flex-start',
							alignItems: 'center',
						}}>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								gap: 12,
							}}>
							<ThemedText
								style={[defaultStyles.bigText, { fontWeight: 500 }]}
								theme={theme}
								value={'Crah is huge'}
							/>

							<ThemedText
								style={[
									{ color: Colors[theme].lightGray, textAlign: 'center' },
								]}
								theme={theme}
								value={'This is the Next Page'}
							/>
						</View>
					</View>
				);

			case 3:
				return (
					<View
						style={{
							flex: 1,
							top: 250,
							justifyContent: 'flex-start',
							alignItems: 'center',
						}}>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								gap: 12,
							}}>
							<ThemedText
								style={[defaultStyles.bigText, { fontWeight: 500 }]}
								theme={theme}
								value={'Page 3'}
							/>

							<ThemedText
								style={[
									{ color: Colors[theme].lightGray, textAlign: 'center' },
								]}
								theme={theme}
								value={'This is the Next Page'}
							/>
						</View>
					</View>
				);

			case 4:
				return (
					<View
						style={{
							flex: 1,
							top: 250,
							justifyContent: 'flex-start',
							alignItems: 'center',
						}}>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								gap: 12,
							}}>
							<ThemedText
								style={[defaultStyles.bigText, { fontWeight: 500 }]}
								theme={theme}
								value={'Page 4'}
							/>

							<ThemedText
								style={[
									{ color: Colors[theme].lightGray, textAlign: 'center' },
								]}
								theme={theme}
								value={'This is the Next Page'}
							/>
						</View>
					</View>
				);

			case 5:
				return (
					<View
						style={{
							flex: 1,
							top: 250,
							justifyContent: 'flex-start',
							alignItems: 'center',
						}}>
						<View
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								gap: 12,
							}}>
							<ThemedText
								style={[defaultStyles.bigText, { fontWeight: 500 }]}
								theme={theme}
								value={'Page 5'}
							/>

							<ThemedText
								style={[
									{ color: Colors[theme].lightGray, textAlign: 'center' },
								]}
								theme={theme}
								value={'This is the Next Page'}
							/>
						</View>
					</View>
				);
		}
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
						}}>
						<ActionContainer />
					</View>

					{/* bottom action container */}
					<View
						style={{
							alignItems: 'center',
							gap: 10,
						}}>
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

const styles = StyleSheet.create({});

export default CreateProfile;
