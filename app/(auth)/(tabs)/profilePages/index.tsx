import { StyleSheet } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import UserProfileContents from '@/components/contents/userProfileContents';

interface trickInterface {
	id: string;
	name: string;
	hardness: number;
}

const Page = () => {
	const { user } = useUser();

	return (
		<UserProfileContents key={Date.now()} userId={user?.id} self={'true'} />
	);
};

const styles = StyleSheet.create({});

export default Page;
