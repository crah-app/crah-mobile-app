import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ThemedView from '../general/ThemedView';
import { useSystemTheme } from '@/utils/useSystemTheme';
import ThemedText from '../general/ThemedText';
import { defaultStyles } from '@/constants/Styles';

interface CompareRidersContentsProps {
	rider1Id: string;
	rider2Id: string;
}

const CompareRidersContents: React.FC<CompareRidersContentsProps> = ({
	rider1Id,
	rider2Id,
}) => {
	const theme = useSystemTheme();

	const [statsRider1Loaded, setStatsRider1Loaded] = useState<boolean>(false);
	const [statsRider2Loaded, setStatsRider2Loaded] = useState<boolean>(false);

	const [rider1Stats, setRider1Stats] = useState<any>();
	const [rider2Stats, setRider2Stats] = useState<any>();

	const fetchUserStats = (userId: string, index: number) => {
		fetch(`http://192.168.0.136:4000/api/users/stats/${userId}`)
			.then((res) => res.json())
			.then((res) => (index === 1 ? setRider1Stats(res) : setRider2Stats(res)))
			.catch((err) =>
				console.warn(
					`An error occurred while loading the user stats of user with the id ${userId}`,
					err,
				),
			);
	};

	useEffect(() => {
		setStatsRider1Loaded(false);
		setStatsRider2Loaded(false);

		fetchUserStats(rider1Id, 1);
		fetchUserStats(rider2Id, 2);
	}, []);

	useEffect(() => {
		if (!statsRider1Loaded || !rider1Stats) return;

		setStatsRider1Loaded(true);

		console.log(rider1Stats);
	}, [statsRider1Loaded, rider1Stats]);

	useEffect(() => {
		if (!statsRider2Loaded || !rider2Stats) return;

		setStatsRider2Loaded(true);

		console.log(rider2Stats);
	}, [statsRider2Loaded, rider2Stats]);

	return (
		<ThemedView flex={1} theme={theme}>
			<View style={{ flexDirection: 'column', gap: 4 }}>
				<ThemedText
					theme={theme}
					value={'Compare yourself and other'}
					style={[defaultStyles.biggerText]}
				/>
				<ThemedText
					theme={theme}
					value={'riders'}
					style={[defaultStyles.biggerText]}
				/>
			</View>

			<View style={[styles.container]}>
				{/* main */}
				<View>
					<View>
						<ThemedText theme={theme} value={rider1Stats?.username} />
					</View>
					<View>
						<ThemedText theme={theme} value={rider2Stats?.username} />
					</View>
				</View>
				{/* footer */}
				<View></View>
			</View>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {},
});

export default CompareRidersContents;
