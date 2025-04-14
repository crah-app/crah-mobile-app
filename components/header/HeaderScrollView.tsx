import Colors from '@/constants/Colors';
import React, { useRef, useState, ReactNode } from 'react';
import {
	View,
	Animated,
	ScrollView,
	StyleSheet,
	NativeSyntheticEvent,
	NativeScrollEvent,
	Dimensions,
} from 'react-native';
import ThemedView from '../general/ThemedView';

const SCROLL_THRESHOLD = 10;

interface HeaderScrollViewProps {
	headerChildren: ReactNode;
	scrollChildren: ReactNode;
	theme: 'light' | 'dark';
	scrollEffect?: boolean;
	scrollEnabled?: boolean;
	headerHeight?: 60 | 120;
}

const HeaderScrollView: React.FC<HeaderScrollViewProps> = ({
	headerChildren,
	scrollChildren,
	theme,
	scrollEffect = true,
	scrollEnabled,
	headerHeight = 60,
}) => {
	const scrollOffset = useRef(0);
	const headerTranslateY = useRef(new Animated.Value(0)).current;
	const [isHeaderVisible, setIsHeaderVisible] = useState(true);

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		if (!scrollEffect) return;

		const currentOffset = event.nativeEvent.contentOffset.y;
		const direction = currentOffset > scrollOffset.current ? 'down' : 'up';
		const scrollDiff = Math.abs(currentOffset - scrollOffset.current);

		// Nur wenn genug gescrollt wurde
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

	return (
		<ThemedView theme={theme} flex={1}>
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

			<ScrollView
				scrollEnabled={scrollEnabled ?? true}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingTop: headerHeight }}
				scrollEventThrottle={16}
				onScroll={handleScroll}>
				{scrollChildren}
			</ScrollView>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 100,
	},
});

export default HeaderScrollView;
