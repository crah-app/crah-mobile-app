import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import UserProfileContents from '@/components/contents/userProfileContents';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface trickInterface {
	id: string;
	name: string;
	hardness: number;
}

const Page = () => {
	const { user } = useUser();

	return (
		<UserProfileContents
			key={Date.now()}
			userId={user?.id as string}
			self={'true'}
			linking={false}
		/>
	);
};

const styles = StyleSheet.create({});

export default Page;
