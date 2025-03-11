import { useSystemTheme } from '@/utils/useSystemTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Row from '../general/Row';
import { CommentPurpose, CommentType } from '@/types';

interface CommentRowProps {
	username: string;
	avatar: string;
	text: string;
	userId: number;
	commentId: number;
	likes: number;
	responses: number;
	date: Date;
	purpose: CommentPurpose;
	type?: CommentType;
}

const CommentRow: React.FC<CommentRowProps> = ({
	username,
	avatar,
	text,
	userId,
	commentId,
	likes,
	responses,
	date,
	purpose,
	type,
}) => {
	const theme = useSystemTheme();

	return (
		<View>
			<Row title={username} subtitle={'lol'} avatarUrl={avatar} />
		</View>
	);
};

const styles = StyleSheet.create({});

export default CommentRow;
