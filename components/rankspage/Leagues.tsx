import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import LeaderBoardUserCircle from '../rankspage/LeaderBoardUserCircle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserRankColumn from '../rows/UserRankRow';

interface LeaguesProps {
	user: string;
}

const LeaguesPage: React.FC<LeaguesProps> = ({ user: User }) => {
	const user = JSON.parse(User);

	const insets = useSafeAreaInsets();

	return (
		<ScrollView style={[styles.leagues_container, { bottom: insets.bottom }]}>
			<View style={styles.TopThreeUsers}>
				<LeaderBoardUserCircle
					width={100}
					height={100}
					imageUri={JSON.stringify(user?.imageUrl)}
					rank={2}
					style={{ top: 30 }}
				/>
				<LeaderBoardUserCircle
					width={120}
					height={120}
					imageUri={JSON.stringify(user?.imageUrl)}
					rank={1}
				/>
				<LeaderBoardUserCircle
					width={100}
					height={100}
					imageUri={JSON.stringify(user?.imageUrl)}
					rank={3}
					style={{ top: 30 }}
				/>
			</View>
			<UserRankColumn
				user={JSON.stringify(user)}
				user_id={Number(user?.id)}
				rank={17}
				best_trick="Quad whip flat"
			/>
			<UserRankColumn
				user={JSON.stringify(user)}
				user_id={Number(user?.id)}
				rank={17}
				best_trick="Quad whip flat"
			/>{' '}
			<UserRankColumn
				user={JSON.stringify(user)}
				user_id={Number(user?.id)}
				rank={17}
				best_trick="Quad whip flat"
			/>{' '}
			<UserRankColumn
				user={JSON.stringify(user)}
				user_id={Number(user?.id)}
				rank={17}
				best_trick="Quad whip flat"
			/>{' '}
			<UserRankColumn
				user={JSON.stringify(user)}
				user_id={Number(user?.id)}
				rank={17}
				best_trick="Quad whip flat"
			/>{' '}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	leagues_container: {},
	TopThreeUsers: {
		paddingTop: 20,
		paddingBottom: 40 + 20,
		width: '100%',
		alignContent: 'center',
		justifyContent: 'space-around',
		gap: 12,
		flexDirection: 'row',
	},
});

export default LeaguesPage;
