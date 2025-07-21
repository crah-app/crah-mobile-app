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
import {
	TrickDifficulty,
	TrickListFilterOptions,
	TrickListOrderTypes,
	TrickTypeUI,
} from '@/types';

interface props {
	theme: 'light' | 'dark';
	handleFilterBtnEvent: (order: TrickListFilterOptions) => void;
}

const OrderTricksByBottomSheetModal = forwardRef<BottomSheetModal, props>(
	({ theme, handleFilterBtnEvent }, ref) => {
		const snapPoints = useMemo(() => ['65%'], []);

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
							height: 450,
						}}>
						<ThemedText
							value={'Select a Filter'}
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
							{Object.keys(TrickTypeUI).map((value, index) => {
								return (
									<PostTypeButton
										key={index}
										val={Object.values(TrickTypeUI)[index]}
										click_action={() =>
											handleFilterBtnEvent(value as TrickListFilterOptions)
										}
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
