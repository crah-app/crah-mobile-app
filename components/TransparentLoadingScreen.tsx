import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import CrahActivityIndicator from './general/CrahActivityIndicator';
import { useSystemTheme } from '@/utils/useSystemTheme';
import Colors from '@/constants/Colors';
import ThemedText from './general/ThemedText';
import { defaultStyles } from '@/constants/Styles';

interface TransparentLoadingScreenProps {
	visible: boolean;
	progress: number;
}

const TransparentLoadingScreen: React.FC<TransparentLoadingScreenProps> = ({
	visible,
	progress,
}) => {
	const theme = useSystemTheme();

	useEffect(() => {
		console.log('hello');
	}, []);

	useEffect(() => {
		console.log(visible);
	}, [visible]);

	return (
		<Modal
			useNativeDriver
			useNativeDriverForBackdrop
			isVisible={visible}
			animationIn={'fadeIn'}
			animationOut={'fadeOut'}
			style={{
				flex: 1,
				width: Dimensions.get('window').width,
				height: Dimensions.get('window').height,
			}}>
			<View
				style={{
					flex: 1,

					// justifyContent: 'center',
					// alignItems: 'center',
				}}>
				<View
					style={{
						width: Dimensions.get('window').width,
						height: Dimensions.get('window').height,
						// flex: 1,
						// position: 'absolute',
						gap: 4,
						// top: Dimensions.get('window').height * 0.45,
						// left: Dimensions.get('screen').width / 2,
						justifyContent: 'center',
						alignItems: 'center',
						// backgroundColor: 'red',
					}}>
					<CrahActivityIndicator size={32} color={Colors[theme].primary} />
					<ThemedText
						style={[defaultStyles.biggerText, { color: Colors[theme].primary }]}
						value={`${progress}%`}
						theme={theme}
					/>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({});

export default TransparentLoadingScreen;
