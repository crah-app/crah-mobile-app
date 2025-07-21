import React, { forwardRef, useCallback, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import ThemedText from '../general/ThemedText';
import Colors from '@/constants/Colors';
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetView,
} from '@gorhom/bottom-sheet';
import { defaultStyles } from '@/constants/Styles';
import PostTypeButton from '../PostTypeButton';
import { useSharedValue } from 'react-native-reanimated';
import { TrickListOrderTypes } from '@/types';

interface props {
	theme: 'light' | 'dark';
	handleOrderBtnEvent: (order: TrickListOrderTypes) => void;
}

const OrderTricksByBottomSheetModal = forwardRef<BottomSheetModal, props>(
	({ theme, handleOrderBtnEvent }, ref) => {
		const currentRef = ref as React.Ref<BottomSheetModal>;

		const OrderOptions = [
			{
				key: 0,
				text: TrickListOrderTypes.DEFAULT,
			},
			{
				key: 1,
				text: TrickListOrderTypes.DIFFICULTY,
			},
			{
				key: 2,
				text: TrickListOrderTypes.LANDED,
			},
			{
				key: 3,
				text: TrickListOrderTypes.NOTLANDED,
			},
		];

		const snapPoints = useMemo(() => ['45%'], []);

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
				backdropComponent={renderBackdrop}
				snapPoints={snapPoints}
				handleIndicatorStyle={{ backgroundColor: 'gray' }}
				backgroundStyle={{
					backgroundColor: Colors[theme].background2,
				}}
				ref={ref}>
				<BottomSheetView>
					<View
						style={{
							flexDirection: 'column',
							gap: 12,
							alignItems: 'center',
							height: 250,
						}}>
						<ThemedText
							value={'Select an Order'}
							theme={theme}
							style={defaultStyles.biggerText}
						/>

						<View
							style={{
								marginTop: 32,
								gap: 18,
								width: Dimensions.get('window').width - 24,
								flexWrap: 'wrap',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							{OrderOptions.map((value, index) => {
								return (
									<PostTypeButton
										key={index}
										val={value.text}
										click_action={() => handleOrderBtnEvent(value.text)}
									/>
								);
							})}
						</View>
					</View>
				</BottomSheetView>
			</BottomSheetModal>
		);
	},
);

const styles = StyleSheet.create({});

export default OrderTricksByBottomSheetModal;
