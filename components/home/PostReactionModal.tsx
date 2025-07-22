import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import {
	View,
	StyleSheet,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	Text,
} from 'react-native';
import { useSystemTheme } from '@/utils/useSystemTheme';
import { ReactionType } from '@/types';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import ThemedText from '../general/ThemedText';
import { defaultStyles } from '@/constants/Styles';
import SearchBar from '../general/SearchBar';
import Reactions from '@/constants/Reactions';

interface props {
	showReactions: boolean;
	setShowReactions: (boolean: boolean) => void;
	handleReaction: (reaction: ReactionType) => void;
	theme: 'light' | 'dark';
}

const UserPostReactionsModal = forwardRef<BottomSheetModal, props>(
	({ setShowReactions, showReactions, handleReaction }, ref) => {
		const theme = useSystemTheme();
		const [snapPoints, setSnapPoints] = useState<string[]>(['85%']);

		const [query, setQuery] = useState<string>('');

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

		useEffect(() => {
			const keyboardShowListener = Keyboard.addListener(
				'keyboardDidShow',
				() => {
					setSnapPoints(['100%']);
				},
			);
			const keyboardHideListener = Keyboard.addListener(
				'keyboardDidHide',
				() => {
					setSnapPoints(['85%']);
				},
			);
			return () => {
				keyboardShowListener.remove();
				keyboardHideListener.remove();
			};
		}, []);

		return (
			<BottomSheetModal
				backdropComponent={renderBackdrop}
				snapPoints={snapPoints}
				handleIndicatorStyle={{ backgroundColor: 'gray' }}
				backgroundStyle={{
					backgroundColor: Colors[theme].background2,
				}}
				ref={ref}
				style={{ flex: 1 }}>
				<BottomSheetView style={{ height: '85%', flex: 1 }}>
					<BottomSheetView style={{ flex: 1 }}>
						<KeyboardAvoidingView
							behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
							keyboardVerticalOffset={70}
							style={{ flex: 1 }}>
							<View
								style={{
									flexDirection: 'column',
									gap: 12,
									paddingHorizontal: 12,
									paddingVertical: 18,
									height: 400,
								}}>
								{/* header */}
								<View style={{ height: 110, gap: 16 }}>
									<ThemedText
										value={'Select a Reaction'}
										theme={theme}
										style={[
											defaultStyles.biggerText,
											{ textAlign: 'center', fontSize: 28 },
										]}
									/>
									<SearchBar
										containerStyle={{
											backgroundColor: Colors[theme].background,
											borderRadius: 12,
										}}
										textInputStyle={{
											backgroundColor: Colors[theme].background,
										}}
										displayLeftSearchIcon
										query={query}
										setQuery={setQuery}
										placeholder={'Search a reaction'}
										onFocus={() => setSnapPoints(['100%'])}
										displayCloseRequestBtn
									/>
								</View>
								{/* reactions container */}
								<View
									style={{
										gap: 24,
										flexDirection: 'row',
										flexWrap: 'wrap',
										paddingHorizontal: 12,
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									{Reactions.map((reaction) => (
										<TouchableOpacity
											key={reaction}
											onPress={() => handleReaction(reaction)}>
											<Text style={{ fontSize: 26 }}>{reaction}</Text>
										</TouchableOpacity>
									))}
								</View>
								{/*  */}
							</View>
						</KeyboardAvoidingView>
					</BottomSheetView>
				</BottomSheetView>
			</BottomSheetModal>
		);
	},
);

const styles = StyleSheet.create({
	iconButton: {
		marginRight: 15,
		alignItems: 'center',
		flexDirection: 'row',
		gap: 5,
	},
	iconCount: {
		fontSize: 13,
		fontWeight: '600',
	},
	reactionCountContainer: {
		fontWeight: 'bold',
		borderRadius: '100%',
		fontSize: 12,
	},
	reactionsGrid: {
		padding: 20,
		borderRadius: 8,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		zIndex: 1,
		gap: 20,
	},
});

export default UserPostReactionsModal;
