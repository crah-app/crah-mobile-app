import { fetchAdresses } from '@/types';
import {
	AssetUnlockedEvent,
	AvatarCreatorEvent,
	AvatarExportedEvent,
	UserAuthorizedEvent,
	UserLoggedOutEvent,
	UserSetEvent,
	UserUpdatedEvent,
} from '@/types/readyplayer';
import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

const user = {
	data: {
		createdAt: '2025-06-18T18:19:43.791Z',
		deleteAt: '',
		email: null,
		externalId: '',
		id: '6853033ff425030277ea495c',
		isAnonymous: true,
		isGuest: true,
		name: '',
		settings: {},
		unverifiedEmail: '',
		updatedAt: '2025-06-18T18:19:43.791Z',
		verifiedAt: '',
		visitedAt: '',
		wallets: [],
	},
};

const RPM_TARGET = 'readyplayerme';

const BuildCharacterUI: React.FC<{ visible: boolean }> = ({ visible }) => {
	const api_key = process.env.REALPLAYERME_API_KEY!;
	const webView = useRef<WebView | null>();
	const [avatarId, setAvatarId] = useState<string>();
	const { bottom } = useSafeAreaInsets();

	const fetchReadyPlayer = async () => {
		try {
			const response = await fetch('https://api.readyplayer.me/v1/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					data: {
						applicationId: '6852f8fb69ac1ad2a564cb8e',
					},
				}),
			});

			const json = await response.json();
			console.log('Ready Player Me User:', json);
		} catch (error) {
			console.error('Fehler beim Erstellen eines RPM-Nutzers:', error);
		}
	};

	const getAllTemplates = async () => {
		const response = await fetch(
			'https://api.readyplayer.me/v2/avatars/templates',
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					mode: 'cors',
					Authorization: 'Bearer 6852ff6a738d5335e2267dd7',
				},
			},
		);

		const data = await response.json();
		console.log('Templates:', data);
	};

	useEffect(() => {
		fetchReadyPlayer();
		getAllTemplates();
	}, []);

	const supportedEvents = {
		'v1.avatar.exported': onAvatarExported,
		'v1.user.set': onUserSet,
		'v1.user.authorized': onUserAuthorized,
		'v1.asset.unlock': onAssetUnlocked,
		'v1.user.updated': onUserUpdated,
		'v1.user.logout': onUserLoggedOut,
	} as Record<string, any>;

	function onAvatarExported(message: AvatarExportedEvent) {
		setAvatarId(message.data.avatarId);
	}

	function onAssetUnlocked(message: AssetUnlockedEvent) {
		Alert.alert(`Asset Unlocked | Asset ID = ${message.data?.assetId}`);
	}

	function onUserAuthorized(message: UserAuthorizedEvent) {
		Alert.alert(`User Authorized | User ID = ${message.data?.id}`);
	}

	function onUserSet(message: UserSetEvent) {
		Alert.alert(`User Set | User ID = ${message.data?.id}`);
	}

	function onUserUpdated(message: UserUpdatedEvent) {
		Alert.alert(`User Updated | User ID = ${message.data?.id}`);
	}

	function onUserLoggedOut(message: UserLoggedOutEvent) {
		Alert.alert(`User Logged Out`);
	}

	function onWebViewLoaded() {
		webView.current?.postMessage(
			JSON.stringify({
				target: 'readyplayerme',
				type: 'subscribe',
				eventName: 'v1.**',
			}),
		);
	}

	function onMessageReceived(message: WebViewMessageEvent) {
		const data = message.nativeEvent.data;
		const event = JSON.parse(data) as AvatarCreatorEvent;

		if (event?.source !== RPM_TARGET || !event.eventName) {
			return;
		}

		supportedEvents[event.eventName]?.(event);
	}

	return (
		<View
			style={{
				flex: 1,
				width: '100%',
				height: '100%',
				marginBottom: bottom * 5.2,
				display: visible ? 'flex' : 'none',
				top: -45 + 20,
			}}>
			<WebView
				ref={webView}
				style={{ marginTop: 30 }}
				onLoad={onWebViewLoaded}
				onMessage={onMessageReceived}
				source={{ uri: 'https://crah.readyplayer.me/avatar' }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default BuildCharacterUI;
