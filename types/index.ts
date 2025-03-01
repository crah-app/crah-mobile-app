import Reactions from '@/constants/Reactions';
import UserPostDummyStructure from '@/JSON/posts.json';
import { Ionicons } from '@expo/vector-icons';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

// Ionicons icon type
export type ionicon = keyof typeof Ionicons.glyphMap;

export type UserPostType = (typeof UserPostDummyStructure)[number]; // the json structure itself
export type PostKeys = keyof UserPostType; // a single key of the json structure

// reaction type based on reactions array
export type ReactionType = (typeof Reactions)[number];

/*
	Third-party websites the user can log in through.
*/

export enum AuthStrategy {
	Google = 'oauth_google',
}

/*
	In this enumaration all addresses the app fetches from the crah-api are listed.
*/

export enum fetchAdresses {
	commonTricks = 'http://192.168.0.136:3000/public/tricks/commonTricks.json',
}

/*
	The JSON structure of the word trick list fetched by the crah-api
*/

export type TricksDataStructure = {
	word: string;
	points: number;
	percentageBefore: Float;
	connect: boolean;
};

/*
	The JSON structure of the common trick list fetched by the crah-api 
*/

export type commonTricksDataStructure = { words: Array<string> };

/*
	User posts are categorized in these types
*/

export enum PostTypes {
	all = 'Show all posts',
	videoLandscape = 'Landscape Videos',
	videoPortrait = 'Portrait Videos',
	text = 'Text',
	article = 'Articles',
	image = 'Images',
}

// General user post types
export enum GeneralPostTypes {
	all = 'All posts',
	videos_and_images = 'Clips',
	articles = 'Articles',
	text = 'Text',
}

// All icons for all post/search types
export enum PostTypeIonicons {
	all = 'albums-outline',
	videoLandscape = 'phone-landscape-outline',
	videoPortrait = 'phone-portrait-outline',
	text = 'chatbox-ellipses-outline',
	article = 'book-outline',
	image = 'images-outline',
}

/* 
	ALl types of content the user can search for on the search page
	including non-post data like the people, stunt scooter riders
	and tricks
*/
export enum SearchTypes {
	all = 'All posts',
	videos_and_images = 'Clips',
	articles = 'Articles',
	text = 'Text',
	riders = 'Riders',
	tricks = 'Tricks',
}

/*
	Determines in which order the client displays user posts or other data search entries
*/
export enum ExplorePostOrder {
	toOldest = 'Latest to oldest',
	toLatest = 'Oldest to latest',
}

/* 
	General topics the user can watch content on
	explore: the user gets recommendation based on what is popular and new at the moment (last days - weeks)
	friends: user only recieves data from friends. (a friend is a follower from both sides)
	rank: the user only recieves data from people being in the same rank as the user itself 
*/

export enum ContentFilterTypes {
	explore = 'explore',
	friends = 'friends',
	rank = 'rank',
}

/* 
	On the chat page the user can filter chats 
*/

export enum ChatFilterTypes {
	all = 'all',
	unread = 'unread',
	groups = 'groups',
}

/* 
	A user can either be offline or online
*/

export enum UserStatus {
	ONLINE = 'online',
	OFFLINE = 'offline',
}

/* 
	On the stats page, the user can switch from sub-page to sub-page
	sub pages are:
	User rank page
	league page
	tricks page
	trick builder page
*/

export enum UserGalleryTopics {
	USER_RANK = 'Your Rank',
	LEAGUES = 'Leagues',
	TRICKS = 'Tricks',
	TRICK_BUILDER = 'Trick Builder',
}

/* 
	Every trick has its own difficulty
*/

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

/* 
	General text input max characters
*/

export enum TextInputMaxCharacters {
	UserName = 25,
	Simple = 50,
	SmallDescription = 250,
	BigDescription = 5000,
}

/* 
	Tags the user can put underneath his post
*/

export enum Tags {
	News = 'News',
	WorldsFirst = "World's First",
	Banger = 'Banger',
	Tutorial = 'Tutorial',
	Story = 'Story',
	Guide = 'Guide',
}

/* 
	Based on his five best tricks, the user gets categorized in a rank with other users
*/

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

/*
	In what order a trick list should be displayed
*/

export enum TrickListOrderTypes {
	DIFFICULTY = 'difficulty', // hardest first
	LANDEDFIRST = 'landed first', // tricks the user has landed first
	LANDEDLAST = 'landed last', // tricks the user has not landed first
}

/*
	What kind of tricks should be displayed
 */

export enum TrickListFilterOptions {
	ALL = 'all',
	SCOOTERFLIPS = 'scooter flips',
	STALLS = 'stalls',
	REWINDS = 'rewinds',
	BODYFLIPS = 'body flips',
	TWISTS = 'twists',
	BALANCE = 'balance',
}
