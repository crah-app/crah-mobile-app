import React from 'react';
import { StyleSheet, View } from 'react-native';
import ThemedText from '../general/ThemedText';
import { useSystemTheme } from '@/utils/useSystemTheme';
import UserImageCircle from '../general/UserImageCircle';
import Colors from '@/constants/Colors';

interface UserRankColumnprops {
	user: string;
	user_id: number;
	rank: number;
	best_trick: string;
}

const UserRankColumn: React.FC<UserRankColumnprops> = ({
	user,
	user_id,
	rank,
	best_trick,
}) => {
	const theme = useSystemTheme();
	const ParsedUser = JSON.parse(user);

	if (!ParsedUser) return <View />;

	return (
		<View
			style={[styles.container, { backgroundColor: Colors[theme].surface }]}>
			{/* left side */}
			<View style={styles.containerInnerLeft}>
				<View style={{ justifyContent: 'center', alignContent: 'center' }}>
					<UserImageCircle
						width={50}
						height={50}
						imageUri={JSON.stringify(ParsedUser?.imageUrl)}
						style={{ borderWidth: 0, padding: 0, margin: 0 }}
					/>
				</View>

				<View style={styles.containerInnerUserInfo}>
					<ThemedText
						value={ParsedUser?.username}
						theme={theme}
						style={{ fontSize: 30 }}
					/>
					<ThemedText
						value={`Rank #${rank}`}
						theme={theme}
						style={{ fontSize: 22 }}
					/>
				</View>
			</View>

			{/* right side */}
			<View style={styles.containerInnerRight}>
				<ThemedText value={`best trick: ${best_trick}`} theme={theme} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 80,
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
		borderTopWidth: 1,
		borderColor: 'white',
	},
	containerInnerLeft: {
		width: '50%',
		height: '100%',
		flexDirection: 'row',
		gap: 10,
	},
	containerInnerRight: {
		width: '50%',
		height: '100%',
		justifyContent: 'flex-end',
		alignContent: 'flex-end',
		padding: 10,
	},
	containerInnerUserInfo: {
		flexDirection: 'column',
		alignContent: 'center',
		justifyContent: 'center',
	},
});

export default UserRankColumn;
