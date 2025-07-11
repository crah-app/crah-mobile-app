import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View, Image } from 'react-native';
import LeaderBoardUserCircle from '../rankspage/LeaderBoardUserCircle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserRankColumn from '../rows/UserRankRow';
import Row from '../general/Row';
import { CrahUser } from '@/types';
import { useUser } from '@clerk/clerk-expo';
import Colors from '@/constants/Colors';
import ThemedText from '../general/ThemedText';
import UserRankRow from '../rows/UserRankRow';
import ClerkUser from '@/types/clerk';
import SearchBar from '../general/SearchBar';
import AllUserRowContainer from '../displayFetchedData/AllUserRowContainer';

interface LeaguesProps {
	theme: 'light' | 'dark';
}

const LeaguesPage: React.FC<LeaguesProps> = ({ theme }) => {
	const { user } = useUser();

	const [query, setQuery] = useState<string>('');

	return (
		<View>
			<View style={[styles.leagues_container]}>
				{/* filter and search */}
				<View
					style={{
						height: 65,
						padding: 8,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<SearchBar
						query={query}
						setQuery={setQuery}
						placeholder={'Find a Rider to compare'}
						displayLeftSearchIcon
						displayOptionsBtn
						containerStyle={{ flex: 0 }}
					/>
				</View>

				<AllUserRowContainer
					contentContainerStyle={{ flex: 0 }}
					// @ts-ignore
					CostumRow={UserRankRow}
				/>
			</View>

			{/* sticky view */}
			<View
				style={{
					padding: 8,
					top: Dimensions.get('window').height - 350,
					zIndex: 2,
					position: 'absolute',
				}}>
				{user && <UserRankRow user={user} isSticky />}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	leagues_container: {
		// marginTop: 24,
		// flex: 1,
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	TopThreeUsers: {
		alignContent: 'center',
		justifyContent: 'space-around',
		flexDirection: 'row',
	},
});

export default LeaguesPage;
