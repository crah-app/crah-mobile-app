import Reactions from '@/constants/Reactions';
import UserPostDummyStructure from '@/JSON/posts.json';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

export type UserPostType = (typeof UserPostDummyStructure)[number]; // the json structure itself
export type PostKeys = keyof UserPostType; // a single key of the json structure

export type ReactionType = (typeof Reactions)[number];

export enum AuthStrategy {
	Google = 'oauth_google',
}

export enum fetchAdresses {
	commonTricks = 'http://192.168.0.136:3000/public/tricks/commonTricks.json',
}

export type TricksDataStructure = {
	word: string;
	points: number;
	percentageBefore: Float;
	connect: boolean;
};
export type commonTricksDataStructure = { words: Array<string> };

// All post types including "all" option for user interaction
export const PostTypes = {
	all: 'Show all posts',
	videoLandscape: 'Landscape Videos',
	videoPortrait: 'Portrait Videos',
	text: 'Text',
	article: 'Articles',
	image: 'Images',
} as const;

// All post types but generalised
export const GeneralPostTypes = {
	all: 'All posts',
	videos_and_images: 'Clips',
	articles: 'Articles',
	text: 'Text',
} as const;

// ALl types of stuff the user can search for includign non-post stuff like the "rider" type and the "tricks" type
export const SearchTypes = {
	all: 'All posts',
	videos_and_images: 'Clips',
	articles: 'Articles',
	text: 'Text',
	riders: 'Riders',
	tricks: 'Tricks',
} as const;

// All icons for all post/search types
export const PostTypeIonicons = {
	all: 'albums-outline',
	videoLandscape: 'phone-landscape-outline',
	videoPortrait: 'phone-portrait-outline',
	text: 'chatbox-ellipses-outline',
	article: 'book-outline',
	image: 'images-outline',
} as const;

// explore post order types
export const ExplorePostOrder = {
	toOldest: 'Latest to oldest',
	toLatest: 'Oldest to latest',
};

export const ContentFilterTypes = ['explore', 'friends', 'rank'];
export const ChatFilterTypes = ['all', 'unread', 'groups'];

export enum UserStatus {
	ONLINE = 'online',
	OFFLINE = 'offline',
}

export enum UserGalleryTopics {
	USER_RANK = 'Your Rank',
	LEAGUES = 'Leagues',
	TRICKS = 'Tricks',
	TRICK_BUILDER = 'Trick Builder',
}

export enum TrickDifficulty {
	NOVICE = 'novice',
	BEGINNER = 'beginner',
	NORMAL = 'normal',
	INTERMEDIATE = 'intermediate',
	ADVANCED = 'advanced',
	HARD = 'hard',
	VERY_HARD = 'very hard',
	MONSTER = 'monster',
	IMPOSSIBLE = 'impossible',
	GOATED = 'goated',
	POTENTIAL_WORLDS_FIRST = 'potential worlds first',
}

export enum TextInputMaxCharacters {
	UserName = 25,
	Simple = 50,
	SmallDescription = 250,
	BigDescription = 5000,
}

export enum Tags {
	News = 'News',
	WorldsFirst = "World's First",
	Banger = 'Banger',
	Tutorial = 'Tutorial',
	Story = 'Story',
	Guide = 'Guide',
}

export type Rank =
	| 'Iron'
	| 'Bronze'
	| 'Silver'
	| 'Gold'
	| 'Platinum'
	| 'Diamond';

/* 
  With a spot, a trick can be specifically categorized which is crucial for point calculation.
  for example, a Flair is much harder on flatground than on a 3 foot quarter 
*/

export enum TrickListSpot {
	Flat = 'Flat',
	IntoBank = 'Into a bank',
	OutOfBank = 'Out of a bank',
	DropIn = 'Drop in',
	Air = 'Air',
	Flyout = 'Flyout',
	OffLedge = 'off ledge',
	UpLedge = 'up ledge',
	ToGrind = 'to grind',
	ToStall = 'to stall',
	Hip = 'Hip',
	Spine = 'Spine',
}

/* 
  A general spot (e.g Park) is a superset which contains atleast one spot (e.g Park[general spot] => (FlyOut , Air )<spot> )
  With general spots included, a trick is filtered easily into a category 
*/
export enum TrickListGeneralSpotCategory {
	ALL = 'All',
	FLAT = 'Flat',
	PARK = 'Park',
	STREET = 'Street',
}

export type PostType = keyof typeof PostTypes;
