import { StyleSheet } from 'react-native';
import React from 'react';
import { useGlobalSearchParams } from 'expo-router/build/hooks';
import UserProfileContents from '@/components/contents/userProfileContents';

interface trickInterface {
	id: string;
	name: string;
	hardness: number;
}

interface UserProfileProps {
	userId: string | undefined;
	self: boolean | 'true' | 'false';
}

const UserProfile = ({}) => {
	const { userId, self, linking } = useGlobalSearchParams<{
		userId: string;
		self: 'false' | 'true';
		linking: 'false' | 'true';
	}>();

	return (
		<UserProfileContents
			linking={linking}
			key={Date.now()}
			userId={userId}
			self={self}
		/>
	);
};

const styles = StyleSheet.create({});

export default UserProfile;
