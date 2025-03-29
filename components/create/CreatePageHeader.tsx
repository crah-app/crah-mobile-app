import { useSystemTheme } from '@/utils/useSystemTheme';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import ThemedText from '../general/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';

interface CreatePageHeaderProps {
	handleUploadClickEvent: () => void;
	title: string;
	previewClickEventHandler: () => void;
	style?: ViewStyle | ViewStyle[];
}

const CreatePageHeader: React.FC<CreatePageHeaderProps> = ({
	handleUploadClickEvent,
	title,
	previewClickEventHandler,
	style,
}) => {
	const theme = useSystemTheme();

	return (
		<View style={[styles.headerContainer, style]}>
			<View
				style={{
					justifyContent: 'space-between',
					flexDirection: 'row',
				}}>
				<ThemedText
					theme={theme}
					value={`${title}`}
					style={defaultStyles.biggerText}
				/>
				<TouchableOpacity
					style={{
						position: 'absolute',
						right: 0,
						padding: 24,
						paddingHorizontal: -24,
					}}
					onPress={handleUploadClickEvent}>
					<Ionicons
						size={24}
						color={Colors[theme].textPrimary}
						name="send-outline"
					/>
				</TouchableOpacity>
			</View>

			<View style={{ marginVertical: 4, width: 150 }}>
				<TouchableOpacity onPress={previewClickEventHandler}>
					<ThemedText
						style={{
							flex: -1,
							borderRadius: 8,
							color: Colors[theme].primary,
						}}
						theme={theme}
						value={'click here for preview'}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		paddingBottom: 12,
	},
});

export default CreatePageHeader;
