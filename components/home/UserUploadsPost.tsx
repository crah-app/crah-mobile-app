import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Row from '../general/Row';

interface UserUploadsPostProps {
	progress: number;
	cover: string;
	videoTitle: string;
}

const UserUploadsPost: React.FC<UserUploadsPostProps> = ({
	progress,
	cover,
	videoTitle,
}) => {
	const [coverUri, setCoverUri] = useState<string>('');

	useEffect(() => {
		console.log(
			'uijfhalihf',
			cover,
			JSON.parse(cover)[0].uri,
			videoTitle,
			progress,
		);

		if (!cover) return;

		setCoverUri(JSON.parse(cover)[0].uri);
	}, [cover]);

	return (
		<Row
			showAvatar={true}
			avatarUrl={coverUri}
			title={videoTitle}
			subtitle={`${progress}% complete`}
		/>
	);
};

const styles = StyleSheet.create({});

export default UserUploadsPost;
