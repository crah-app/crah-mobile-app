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

	type step = 0 | 1 | 2 | 3 | 4 | 5;

	const [stepsComplete, setStepsComplete] = useState<step>(0);
	const [currentStep, setCurrentStep] = useState<step>(0);

	const ActionContainer = () => {
		return (
			<View
				style={{
					flex: 1,
					top: 250,
					justifyContent: 'flex-start',
					alignItems: 'center',
					// width: '100%',
					// height: '100%',
				}}>
				<View
					style={{ justifyContent: 'center', alignItems: 'center', gap: 12 }}>
					<ThemedText
						style={[defaultStyles.bigText, { fontWeight: 500 }]}
						theme={theme}
						value={'Nice, that you are here!'}
					/>

					<ThemedText
						style={[{ color: Colors[theme].lightGray, textAlign: 'center' }]}
						theme={theme}
						value={
							'Blib Blab Blub. Blib Blab Blub.Blib Blab Blub.Blib Blab Blub.Blib Blab Blub.Blib Blab Blub.Blib Blab Blub.Blib Blab Blub.'
						}
					/>
				</View>
			</View>
		);
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
							<ProgressionBar theme={theme} progress={5} />
						</View>
					}
				/>
			}
			scrollChildren={
				<View style={{ flex: 1 }}>
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
							flex: 1,
							justifyContent: 'flex-end',
							alignItems: 'center',
							bottom: bottom * 4,
						}}>
						<TouchableOpacity
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
					</View>
				</View>
			}
			theme={theme}
		/>
	);
};

const styles = StyleSheet.create({});

export default CreateProfile;
