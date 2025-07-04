import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CreatePostType, dropDownMenuInputData } from '@/types';
import ThemedText from './general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
// import DropDownMenu from './general/DropDownMenu';

interface CreatePostDropDownMenu {}

interface dropMenuDataInterface {
	type: CreatePostType;
	path: pathType;
}

enum pathType {
	createVideo = '/(auth)/(tabs)/createPages/createVideo',
	createTextPost = '/(auth)/(tabs)/createPages/createTextPost',
	createArticle = '/(auth)/(tabs)/createPages/createArticle',
}

const dropMenuData: Record<CreatePostType, dropMenuDataInterface> = {
	[CreatePostType.video]: {
		type: CreatePostType.video,
		path: pathType.createVideo,
	},
	[CreatePostType.post]: {
		type: CreatePostType.post,
		path: pathType.createTextPost,
	},
	[CreatePostType.article]: {
		type: CreatePostType.article,
		path: pathType.createArticle,
	},
};

const dropDownMenuItemsData: dropDownMenuInputData[] = [
	{
		key: 0,
		text: CreatePostType.video,
	},
	{
		key: 1,
		text: CreatePostType.post,
	},
	{
		key: 2,
		text: CreatePostType.article,
	},
];

const CreatePostDropDownMenu: React.FC<CreatePostDropDownMenu> = ({}) => {
	const handleSelect = (key: number) => {
		router.push(Object.values(dropMenuData)[key].path);
	};

	const theme = useSystemTheme();

	return (
		<View>
			<ThemedText theme={theme} value={'implement zeego'} />
		</View>
		// <DropDownMenu
		// 	onSelect={handleSelect}
		// 	triggerComponent={
		// 		<TouchableOpacity style={styles.plusButtonContainer}>
		// 			<View style={styles.plusButton}>
		// 				<Ionicons name="add" size={30} color="#FFF" />
		// 			</View>
		// 		</TouchableOpacity>
		// 	}
		// 	items={dropDownMenuItemsData}
		// />
	);
};

const styles = StyleSheet.create({
	plusButtonContainer: {
		bottom: 0,
		alignItems: 'center',
	},
	plusButton: {
		width: 50,
		height: 50,
		borderRadius: 30,
		backgroundColor: Colors.default.primary,
		justifyContent: 'center',
		alignItems: 'center',
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
	},
});

export default CreatePostDropDownMenu;
