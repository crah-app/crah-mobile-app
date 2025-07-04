import React, { useRef, useState, ReactNode, useEffect } from 'react';
import {
	Animated,
	NativeScrollEvent,
	NativeSyntheticEvent,
	StyleSheet,
	View,
	RefreshControl,
	Dimensions,
	ListRenderItem,
	SafeAreaView,
} from 'react-native';
import ThemedView from '../general/ThemedView';
import Colors from '@/constants/Colors';
import { ContentFilterTypes } from '@/types';
import NoDataPlaceholder from '../general/NoDataPlaceholder';
import CrahActivityIndicator from '../general/CrahActivityIndicator';
import UserPost from '../home/UserPost';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';

const SCROLL_THRESHOLD = 10;

interface HeaderFlashListProps<T> {
	headerChildren: ReactNode;
	data: T[];
	renderItem: ListRenderItem<T>;
	theme: 'light' | 'dark';
	scrollEffect?: boolean;
	headerHeight?: number;
	refreshing: boolean;
	setRefreshing: (b: boolean) => void;
	onRefresh?: () => void;
	keyExtractor: (item: T, index: number) => string;
	ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
	ListFooterComponent?: ReactNode;
	childrenAboveList?: ReactNode;
	dataLoaded: boolean | undefined;
	errWhileLoading: boolean | undefined;
}

function HeaderFlashList<T>({
	headerChildren,
	data,
	renderItem,
	theme,
	scrollEffect = true,
	headerHeight = 60,
	refreshing = false,
	setRefreshing,
	onRefresh,
	keyExtractor,
	ListEmptyComponent,
	ListFooterComponent,
	childrenAboveList,
	dataLoaded,
	errWhileLoading,
}: HeaderFlashListProps<T>) {
	const scrollOffset = useRef(0);
	const headerTranslateY = useRef(new Animated.Value(0)).current;
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);
	const sectionListRef = useRef<FlashList<T>>(null);

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		if (!scrollEffect) return;

		const currentOffset = event.nativeEvent.contentOffset.y;
		const direction = currentOffset > scrollOffset.current ? 'down' : 'up';
		const scrollDiff = Math.abs(currentOffset - scrollOffset.current);

		if (scrollDiff < SCROLL_THRESHOLD) {
			scrollOffset.current = currentOffset;
			return;
		}

		if (direction === 'down' && isHeaderVisible) {
			Animated.timing(headerTranslateY, {
				toValue: -headerHeight,
				duration: 200,
				useNativeDriver: true,
			}).start();
			setIsHeaderVisible(false);
		} else if (direction === 'up' && !isHeaderVisible) {
			Animated.timing(headerTranslateY, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start();
			setIsHeaderVisible(true);
		}

		scrollOffset.current = currentOffset;
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		if (onRefresh) {
			await onRefresh();
		}
		setRefreshing(false);
	};

	// useEffect, um den Header zurückzusetzen, wenn die Daten neu geladen wurden
	useEffect(() => {
		if (dataLoaded && !errWhileLoading) {
			// Header sichtbar machen, wenn die Daten erfolgreich geladen wurden
			Animated.timing(headerTranslateY, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start();
			setIsHeaderVisible(true);

			// Optionale Rücksetzung der Scroll-Position
			flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
		}
	}, [dataLoaded, errWhileLoading]);

	const { top } = useSafeAreaInsets();

	return (
		<ThemedView theme={theme} flex={1} style={{ top }}>
			{/* 🔝 Fixed Header */}
			<Animated.View
				style={[
					styles.header,
					{
						transform: [{ translateY: headerTranslateY }],
						height: headerHeight,
					},
				]}>
				{headerChildren}
			</Animated.View>

			{/* 🔽 Content + FlatList (scrolled together) */}
			{dataLoaded ? (
				errWhileLoading ? (
					<NoDataPlaceholder
						containerStyle={[styles.PlaceholderContentContainer]}
						firstTextValue="Something went wrong, please try again."
						subTextValue=""
						arrowStyle={{ display: 'none' }}
					/>
				) : data && data.length > 0 ? (
					// @ts-ignore
          <FlashList
									numColumns={3}
									contentContainerStyle={{
										padding: 16,
									}}
									data={
                  data
									}
									keyExtractor={(item) => item.Name}
									renderItem={({ item }) => (
										<View style={{ padding: 4 }}>
											<Tag
												style={{}}
												handleTagPress={() => {}
												tag={item.Name}
												theme={theme}
											/>
										</View>
									)}
									estimatedItemSize={100}
								/>

				) : (
					<NoDataPlaceholder
						containerStyle={[styles.PlaceholderContentContainer]}
						firstTextValue="No posts here yet..."
						subTextValue="Start creating and sharing!"
						onSubTextClickPathname="/(auth)/(tabs)/createPages/createVideo"
						arrowStyle={{ display: 'none' }}
					/>
				)
			) : (
				<View style={[styles.PlaceholderContentContainer]}>
					<CrahActivityIndicator size={32} color={Colors[theme].primary} />
				</View>
			)}
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 100,
		backgroundColor: 'transparent',
	},
	flatListContent: {
		paddingBottom: 40,
		flexGrow: 1,
	},
	ContentFilterContainer: {
		alignItems: 'flex-end',
		justifyContent: 'space-around',
		flexDirection: 'row',
	},
	PlaceholderContentContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height * 0.5,
	},
});

export default HeaderFlashList;
