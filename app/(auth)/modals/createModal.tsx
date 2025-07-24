import React, { forwardRef, useCallback, useMemo, useRef } from 'react';
import { router, Tabs, useSegments } from 'expo-router';
import { StyleSheet, View, StatusBar, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { Ionicons } from '@expo/vector-icons';
import GetSVGMemo from '@/components/GetSVG';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import ThemedText from '@/components/general/ThemedText';
import { defaultStyles } from '@/constants/Styles';
import PostTypeButton from '@/components/PostTypeButton';

interface Props {
	theme: 'light' | 'dark';
}

const CreateModal = forwardRef<BottomSheetModal, Props>(({}, ref) => {
	const theme = useSystemTheme();

	const snapPoints = useMemo(() => ['60%'], []);

	const renderBackdrop = useCallback((props: any) => {
		const animatedIndex = useSharedValue(0);
		const animatedPosition = useSharedValue(1);

		return (
			<BottomSheetBackdrop
				animatedIndex={animatedIndex}
				animatedPosition={animatedPosition}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		);
	}, []);

	const handlCloseModalPress = useCallback(() => {
		// @ts-ignore
		ref.current?.close();
	}, []);

	const handleNewTrickPress = () => {
		handlCloseModalPress();
		router.push('/(auth)/(tabs)/statsPages');
	};

	const handleVideoClipPress = () => {
		handlCloseModalPress();
		router.push('/(auth)/(tabs)/createPages/createVideo');
	};

	const handleImageTextPress = () => {
		handlCloseModalPress();
		router.push('/(auth)/(tabs)/createPages/createTextPost');
	};

	const handleArticlePress = () => {
		handlCloseModalPress();
		router.push('/(auth)/(tabs)/createPages/createArticle');
	};

	return (
		<BottomSheetModal
			containerStyle={{}}
			backdropComponent={renderBackdrop}
			handleIndicatorStyle={{ backgroundColor: 'gray' }}
			backgroundStyle={{
				backgroundColor: Colors[theme].background2,
			}}
			ref={ref}
			index={1}
			snapPoints={snapPoints}>
			<BottomSheetView>
				<View
					style={{
						flexDirection: 'column',
						justifyContent: 'space-between',
					}}>
					<View
						style={{
							width: '100%',
							justifyContent: 'center',
							alignItems: 'center',
							marginBottom: 20,
						}}>
						<ThemedText
							theme={theme}
							value={'Create Center'}
							style={[defaultStyles.bigText, { fontWeight: '700' }]}
						/>
					</View>
				</View>

				{/* container */}
				<View
					style={{
						flexDirection: 'column',
						alignItems: 'flex-start',
						padding: 12,
						gap: 36,
					}}>
					{/* block */}
					<View
						style={{
							gap: 12,
							width: '100%',
						}}>
						<ThemedText
							theme={theme}
							value={'self'}
							style={{ color: Colors[theme].gray, fontSize: 20 }}
						/>

						<PostTypeButton
							style={{ width: '100%' }}
							val="New Trick"
							click_action={handleNewTrickPress}
						/>
					</View>

					{/* block */}
					<View
						style={{
							gap: 12,
							width: '100%',
						}}>
						<ThemedText
							theme={theme}
							value={'community'}
							style={{ color: Colors[theme].gray, fontSize: 20 }}
						/>

						<PostTypeButton
							style={{ width: '100%' }}
							val="Post Video/Clip"
							click_action={handleVideoClipPress}
						/>

						<PostTypeButton
							style={{ width: '100%' }}
							val="Post Text/Image"
							click_action={handleImageTextPress}
						/>

						<PostTypeButton
							style={{ width: '100%' }}
							val="Post Article"
							click_action={handleArticlePress}
						/>

						{/* <PostTypeButton
							style={{ width: '100%' }}
							val="Post Music"
							click_action={handleNewTrickPress}
						/> */}
					</View>
				</View>
				{/*  */}
			</BottomSheetView>
		</BottomSheetModal>
	);
});

const styles = StyleSheet.create({});

export default CreateModal;
