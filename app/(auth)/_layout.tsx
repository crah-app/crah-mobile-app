import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Layout = () => {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen name="modals" options={{ headerShown: false }} />
			<Stack.Screen name="sharedPages" options={{ headerShown: false }} />
		</Stack>
	);
};

const styles = StyleSheet.create({});

export default Layout;
