import { SearchCategories } from '@/types';

export const filterPosts = (
	posts: any[],
	type: SearchCategories | string,
): any[] => {
	if (type === SearchCategories.allPosts) {
		return posts;
	}
	return posts.filter((post) => post.type === type);
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
		default:
			return 'application/octet-stream'; // Fallback for unknown types
	}
}
