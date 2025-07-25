import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const GetRegion = () => {
	const [location, setLocation] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch('https://ipinfo.io/json?token=<YOUR_TOKEN>')
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setLocation(data);
			})
			.catch((error) => {
				console.error('Error fetching IP info:', error);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <ActivityIndicator />;
	}

	return (
		<View style={{ padding: 20 }}>
			<Text>IP: {location?.ip}</Text>
			<Text>Country: {location?.country}</Text>
			<Text>Region: {location?.region}</Text>
			<Text>City: {location?.city}</Text>
		</View>
	);
};

export default GetRegion;
