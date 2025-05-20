import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RankColors, Rank } from '@/types';

interface AuraUserProfileRank {
	rank: Rank;
}

const AuraUserProfile: React.FC<AuraUserProfileRank> = ({ rank }) => {
	return (
		<View style={styles.avatarWrapper}>
			<LinearGradient
				// @ts-ignore
				colors={RankColors[rank]}
				style={styles.rankAura}>
				<Image
					style={[{ borderRadius: 100 }, styles.avatarImage]}
					width={100}
					height={100}
					source={{
						uri:
							// (otherUserProfile as string)
							'https://randomuser.me/api/portraits/men/32.jpg',
					}}
				/>
			</LinearGradient>
		</View>
	);
};

const styles = StyleSheet.create({
	avatarWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	rankAura: {
		padding: 4,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarImage: {
		width: 120,
		height: 120,
		borderRadius: 60,
	},
});

export default AuraUserProfile;
