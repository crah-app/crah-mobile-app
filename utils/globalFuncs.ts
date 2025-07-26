import { Rank, RawPost, SearchCategories, upload_source_ratio } from '@/types';
import { Dimensions } from 'react-native';

export const filterPosts = (
	posts: RawPost[],
	type: SearchCategories | string,
): any[] => {
	if (type === SearchCategories.allPosts) {
		return posts;
	}
	return posts.filter((post) => post.Type === type);
};

export function getTrickTitle(fetchedTrick?: {
	words?: (string | undefined | null)[];
}): string {
	const words = fetchedTrick?.words?.filter(Boolean);
	if (words && words.length > 0) {
		return words.join(' ');
	}
	return 'Error loading trick';
}

export const fetchLinkPreview = async (url: string | undefined) => {
	try {
		const response = await fetch(
			`http://192.168.0.136:4000/api/chats/link-preview`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ url }),
			},
		);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error while loading preview:', error);
		return null;
	}
};

export function getMIMEType(filename: string): string {
	const ext = filename.split('.').pop()?.toLowerCase();

	switch (ext) {
		// Video
		case 'mp4':
			return 'video/mp4';
		case 'mov':
			return 'video/quicktime';
		case 'webm':
			return 'video/webm';
		case 'avi':
			return 'video/x-msvideo';
		case 'mkv':
			return 'video/x-matroska';

		// Audio
		case 'mp3':
			return 'audio/mpeg';
		case 'wav':
			return 'audio/wav';
		case 'aac':
			return 'audio/aac';
		case 'ogg':
			return 'audio/ogg';
		case 'm4a':
			return 'audio/mp4';
		case 'flac':
			return 'audio/flac';
		case 'opus':
			return 'audio/opus';
		case 'amr':
			return 'audio/amr';

		default:
			return 'application/octet-stream'; // Fallback for unknown types
	}
}

export async function sleep(ms: number) {
	await setTimeout(async () => {}, ms);
}

export function calculateDimensions(sourceWidth: number, sourceHeight: number) {
	const screenWidth = Dimensions.get('window').width;
	const screenHeight = Dimensions.get('window').height;

	const sourceRatio = sourceWidth / sourceHeight;
	const screenRatio = screenWidth / screenHeight;

	let width: number;
	let height: number;

	if (sourceRatio < 1) {
		// Portrait oder Hochformat
		width = screenWidth * 0.8;
		height = (width / sourceRatio) * 0.8;
	} else {
		// Landscape oder Querformat
		height = screenHeight;
		width = height * sourceRatio;

		// Falls Breite zu groß, auf screenWidth begrenzen
		if (width > screenWidth) {
			width = screenWidth;
			height = width / sourceRatio;
		}
	}

	return { width, height };
}

export function evaluateTextBasedOnRankNumber(rank: number): string {
	switch (rank) {
		case 0:
			return 'Start your Journey here!';

		case 1:
			return 'Keep going!';

		case 2:
			return 'Never give up!';

		case 3:
			return 'You have a lot of potential!';

		case 4:
			return 'You are a beast!';

		case 5:
			return 'You are a pro!';

		case 6:
			return 'You are the Goat 🐐!';

		default:
			return 'Thank you for using Crah!';
	}
}

export function emojiToCodePoint(emoji: string): string {
	const codePoint = emoji.codePointAt(0);
	if (codePoint === undefined) return '';
	return codePoint.toString(16).toUpperCase();
}

export function formatErrorMessage(error: unknown): string {
	if (!error) return 'Unknown error occurred.';

	if (typeof error === 'string') return error;

	if (error instanceof Error) {
		// Netzwerkfehler spezifisch behandeln
		if (error.message.includes('Network request failed')) {
			return 'Cannot reach the server. Please check your internet connection.';
		}
		return error.message;
	}

	// Falls z. B. ein Axios-ähnliches error.response.status vorhanden ist
	if ((error as any)?.response?.status) {
		return `Request failed with status ${(error as any).response.status}`;
	}

	// Fallback
	if (
		typeof error === 'object' &&
		'toString' in error &&
		typeof error.toString === 'function'
	) {
		return error.toString();
	}

	return 'Something went wrong.';
}
