import { Link } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { UserStatus } from '@/types';
import Column from '@/components/general/Row';

interface MessageRowProps {
	id: number;
	name: string;
	avatar: string;
	status: UserStatus;
	lastActive?: Date;
}

const MessageRow: React.FC<MessageRowProps> = ({
	id,
	name,
	avatar,
	status,
	lastActive,
}) => {
	const chatTimeAgo = lastActive
		? `last seen ${formatDistanceToNow(new Date(lastActive), {
				addSuffix: true,
		  })}`
		: '';

	return (
		<Link
			asChild
			href={{
				pathname: '/(auth)/(tabs)/homePages/chats/[id]',
				params: { id },
			}}>
			<Column
				title={name}
				subtitle={status === UserStatus.OFFLINE ? chatTimeAgo : status}
				showAvatar={true}
				avatarUrl={avatar}
			/>
		</Link>
	);
};

export default MessageRow;
