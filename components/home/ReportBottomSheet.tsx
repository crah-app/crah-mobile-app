import Colors from '@/constants/Colors';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
	Dispatch,
	forwardRef,
	SetStateAction,
	useCallback,
	useMemo,
	useState,
} from 'react';
import {
	Dimensions,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import ThemedText from '../general/ThemedText';
import { ReportType, TextInputMaxCharacters } from '@/types';
import { defaultStyles } from '@/constants/Styles';
import ThemedTextInput from '../general/ThemedTextInput';
import PostTypeButton from '../PostTypeButton';

interface Props {
	theme: 'light' | 'dark';
	reportType: ReportType;
	reportFunction: () => Promise<void>;
	value: string;
	setValue: Dispatch<SetStateAction<string>>;
}

// report posts, users
const ReportBottomSheet = forwardRef<BottomSheetModal, Props>(
	({ theme, reportType, reportFunction, value, setValue }, ref) => {
		const snapPoints = useMemo(() => ['75%'], []);

		const handleSendPress = () => {
			setValue('');
			reportFunction();
		};

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

		return (
			<BottomSheetModal
				index={1}
				backdropComponent={renderBackdrop}
				snapPoints={snapPoints}
				handleIndicatorStyle={{ backgroundColor: 'gray' }}
				backgroundStyle={{
					backgroundColor: Colors[theme].background2,
				}}
				ref={ref}>
				<BottomSheetView>
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
						keyboardVerticalOffset={10}>
						<View style={{ gap: 12 }}>
							{/* header text */}
							<ThemedText
								theme={theme}
								value={`Report ${reportType}`}
								style={[defaultStyles.biggerText, { textAlign: 'center' }]}
							/>

							{/* main */}
							<View
								style={{
									flexDirection: 'column',
								}}>
								<ThemedTextInput
									theme={theme}
									placeholder="Describe the issue here."
									value={value}
									setValue={setValue}
									multiline
									lines={24}
									maxLength={TextInputMaxCharacters.Report}
									showLength
									outerContainerStyle={{
										width: Dimensions.get('window').width,
									}}
									style={{
										width: Dimensions.get('window').width - 32,
										backgroundColor: Colors[theme].background,
									}}
									textInputWrapperStyle={{
										backgroundColor: Colors[theme].background,
										borderRadius: 12,
										padding: 8,
									}}
								/>
								<PostTypeButton
									val="Send Report"
									click_action={handleSendPress}
									style={{
										marginHorizontal: 12,
										width: Dimensions.get('window').width - 24,
									}}
								/>
							</View>
						</View>
					</KeyboardAvoidingView>
				</BottomSheetView>
			</BottomSheetModal>
		);
	},
);

const styles = StyleSheet.create({});

export default React.memo(ReportBottomSheet);
