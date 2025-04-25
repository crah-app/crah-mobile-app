import * as React from 'react';
import { Link, Stack } from 'expo-router';
import { Button, ScrollView, View } from 'react-native';

import { Asset, getAlbumsAsync, getAssetsAsync } from 'expo-media-library';
import { Image } from 'expo-image';
import { useEffect } from 'react';

export default function MediaLibrary() {
	const [assets, setAssets] = React.useState<Asset[]>([]);

	React.useEffect(() => {
		getAlbums();
	}, []);

	async function getAlbums() {
		const fetchedAlbums = await getAlbumsAsync({
			includeSmartAlbums: true,
		});

		// Recents album
		const albumAssets = await getAssetsAsync({
			album: fetchedAlbums.find((album) => album.title === 'Recentsd'),
			mediaType: 'photo',
			sortBy: 'creationTime',
		});
		setAssets(albumAssets.assets);
	}

	useEffect(() => {
		console.log(assets);

		return () => {};
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: 'red' }}>
			<ScrollView
				contentContainerStyle={{
					paddingTop: 50,
					flexDirection: 'row',
					flexWrap: 'wrap',
				}}>
				{/* <Stack.Screen
				options={{
					title: 'Your Library',
					headerTransparent: true,
					headerBlurEffect: 'dark',
					headerLeft: () => (
						<Link href={'/'} asChild>
							<Button title="Cancel" />
						</Link>
					),
				}}
			/> */}
				{assets.map((photo) => (
					<Image
						key={photo.id}
						source={photo.uri}
						style={{
							width: '25%',
							height: 100,
						}}
					/>
				))}
			</ScrollView>
		</View>
	);
}
