import { useSystemTheme } from '@/utils/useSystemTheme';
import React from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	useWindowDimensions,
	View,
	ViewStyle,
} from 'react-native';
import ThemedView from '../general/ThemedView';
import PostTypeButton from '../PostTypeButton';
import ThemedText from '../general/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { GeneralPostTypes } from '@/types';
import Modal from 'react-native-modal';

interface PostTypeFilterModalProps {
	FilterIsVisible: boolean;
	setFilterVisibility: (visible: boolean) => void;
	FilterPosts: (prop: string) => any;
	style?: ViewStyle | ViewStyle[];
}

const PostTypeFilterModal: React.FC<PostTypeFilterModalProps> = ({
	FilterIsVisible,
	setFilterVisibility,
	FilterPosts,
}) => {
	const theme = useSystemTheme();
	const { width } = useWindowDimensions();

	return (
		<Modal
			useNativeDriver={true}
			useNativeDriverForBackdrop={true}
			isVisible={FilterIsVisible}
			animationIn={'fadeIn'}
			animationOut={'fadeOut'}
			onBackdropPress={() => setFilterVisibility(false)}>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<View
					style={[
						styles.popUpInnerWrapper,
						{
							width: (width / 10) * 8,
							height: 300,
							borderRadius: 20,
							overflow: 'hidden',
							backgroundColor: Colors[theme].surface,
						},
					]}>
					<ThemedView theme={theme} style={[styles.header]}>
						<TouchableOpacity onPress={() => setFilterVisibility(false)}>
							<Ionicons
								name="close"
								size={24}
								color={Colors[theme].textPrimary}
							/>
						</TouchableOpacity>
						<ThemedText
							theme={theme}
							value={'Filter Content'}
							style={{ fontSize: 25, fontWeight: '600' }}
						/>
						<View></View>
					</ThemedView>
					<ThemedView theme={theme} style={[styles.main]} flex={1}>
						<View style={[styles.FilterGrid]}>
							{Object.values(GeneralPostTypes).map((val, key) => (
								<PostTypeButton
									key={key}
									val={val}
									click_action={() =>
										FilterPosts(`${Object.keys(GeneralPostTypes)[key]}`)
									}
								/>
							))}
						</View>
					</ThemedView>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	popUpInnerWrapper: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 5,
		borderRadius: 20,
	},
	PopUpBackground: {
		flex: 1,
		backgroundColor: '#000000cc',
		justifyContent: 'center',
		alignItems: 'center',
	},
	main: {
		width: '100%',
		paddingHorizontal: 20,
	},
	FilterGrid: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 15,
		height: '100%',
	},
	FilterButton: {
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 15,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 3,
		width: 200,
	},
	FilterButtonText: {
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center',
	},
	header: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		paddingVertical: 10,
		alignItems: 'center',
	},
});

export default PostTypeFilterModal;
