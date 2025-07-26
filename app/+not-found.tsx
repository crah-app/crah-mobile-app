import ThemedText from '@/components/general/ThemedText';
import ThemedView from '@/components/general/ThemedView';
import CostumHeader from '@/components/header/CostumHeader';
import HeaderLeftLogo from '@/components/header/headerLeftLogo';
import HeaderScrollView from '@/components/header/HeaderScrollView';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { router } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

const NotFound = () => {
	const theme = useSystemTheme();
	return (
		<HeaderScrollView
			theme={theme}
			headerChildren={
				<CostumHeader headerLeft={<HeaderLeftLogo />} theme={theme} />
			}
			scrollChildren={
				<ThemedView
					flex={1}
					theme={theme}
					style={{ justifyContent: 'center', alignItems: 'center' }}>
					<StatusBar backgroundColor={Colors[theme].background} />

					<ThemedText
						theme={theme}
						value={'Page could not be found'}
						style={[defaultStyles.bigText, { bottom: 100 }]}
					/>

					<TouchableOpacity onPress={router.back}>
						<ThemedText
							theme={theme}
							value={'Back'}
							style={[
								defaultStyles.bigText,
								{ bottom: 100, color: Colors.default.primary },
							]}
						/>
					</TouchableOpacity>
				</ThemedView>
			}
		/>
	);
};

const styles = StyleSheet.create({});

export default NotFound;
