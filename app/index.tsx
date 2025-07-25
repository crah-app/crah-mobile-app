import React from 'react';
import { StyleSheet, View } from 'react-native';
import BottomAuthSheet from '@/components/BottomAuthSheet';
import Colors from '@/constants/Colors';
import WelcomeTitle from '@/components/WelcomeTitle';
import { useSystemTheme } from '@/utils/useSystemTheme';
import GetSVG from '@/components/GetSVG';

const Page = () => {
	const theme = useSystemTheme();
	return (
		<View style={styles.container}>
			<WelcomeTitle />
			{/* {theme == `dark` ? (
				<GetSVG
					props={{ width: 250, height: 250 }}
					name="crah_transparent_black"
				/>
			) : (
				<GetSVG props={{ width: 250, height: 250 }} name="crah_transparent" />
			)} */}

			<BottomAuthSheet />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.default.background2,
	},
});

export default Page;
