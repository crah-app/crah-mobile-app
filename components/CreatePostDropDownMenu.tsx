import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CreatePostType, dropDownMenuInputData } from '@/types';
import DropDownMenu from './general/DropDownMenu';

interface CreatePostDropDownMenu {}

interface dropMenuDataInterface {
	type: CreatePostType;
	path: pathType;
}

type pathType =
	| '/(auth)/createPages/createVideo'
	| '/(auth)/createPages/createTextPost'
	| '/(auth)/createPages/createArticle';

const dropMenuData: Record<CreatePostType, dropMenuDataInterface> = {
	[CreatePostType.video]: {
		type: CreatePostType.video,
		path: '/(auth)/createPages/createVideo',
	},
	[CreatePostType.image]: {
		type: CreatePostType.image,
		path: '/(auth)/createPages/createTextPost',
	},
	[CreatePostType.article]: {
		type: CreatePostType.article,
		path: '/(auth)/createPages/createArticle',
	},
};

const dropDownMenuItemsData: dropDownMenuInputData[] = [
	{
		key: 0,
		text: CreatePostType.video,
	},
	{
		key: 1,
		text: CreatePostType.image,
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

	return (
		<DropDownMenu
			onSelect={handleSelect}
			triggerComponent={
				<TouchableOpacity style={styles.plusButtonContainer}>
					<View style={styles.plusButton}>
						<Ionicons name="add" size={30} color="#FFF" />
					</View>
				</TouchableOpacity>
			}
			items={dropDownMenuItemsData}
		/>
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
