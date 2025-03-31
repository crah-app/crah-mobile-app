import {
	View,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	ScrollView,
	SafeAreaView,
	Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedView from '@/components/general/ThemedView';
import { useUser } from '@clerk/clerk-expo';
import {
	Link,
	router,
	useGlobalSearchParams,
	useLocalSearchParams,
} from 'expo-router';
import ThemedText from '@/components/general/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import NoDataPlaceholder from '@/components/general/NoDataPlaceholder';
import UserPostGridItem from '@/components/UserPostGridItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import {
	BestTrickType,
	dropDownMenuInputData,
	GeneralPostTypes,
	GeneralPostTypesIonicons,
	PostTypeIonicons,
} from '@/types';

// dummy data
import tricks from '@/JSON/tricks.json';
import posts from '../../../../JSON/posts.json';
import UserImageCircle from '@/components/general/UserImageCircle';
import { defaultStyles } from '@/constants/Styles';
import DropDownMenu from '@/components/general/DropDownMenu';
import UserProfile from '@/app/(auth)/(tabs)/sharedPages/userProfile';

interface trickInterface {
	id: string;
	name: string;
	hardness: number;
}

const Page = () => {
	const { user } = useUser();
	// const { userId, self } = useGlobalSearchParams<{
	// 	userId: string;
	// 	self: 'false' | 'true';
	// }>();

	return (
		<UserProfile parseFromProps={true} userId={user?.id} callingSelf={'true'} />
	);
};

const styles = StyleSheet.create({});

export default Page;
