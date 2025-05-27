import Reactions from '@/constants/Reactions';
import UserPostDummyStructure from '@/JSON/posts.json';
import { Ionicons } from '@expo/vector-icons';
import { IMessage, User } from 'react-native-gifted-chat';
import { PhotoFile, VideoFile } from 'react-native-vision-camera';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

// Ionicons icon type
export type ionicon = keyof typeof Ionicons.glyphMap;

export interface RawComment {
	Id: number;
	PostId: number;
	UserId: string;
	Message: string;
	CreatedAt: string; // ISO-Date string from MySQL DATETIME
	UpdatedAt: string; // ISO-Date string from MySQL DATETIME
}

export type RawPost = {
	Id: number;

	UserId: string;
	UserName: string;
	UserAvatar: string;

	Type: 'Article' | 'Video' | 'Image' | 'Music' | 'Text';
	Title: string | null;
	Description: string;
	Content: string | null;
	CreatedAt: string; // ISO-Date as string
	UpdatedAt: string; // ISO-Date as string
	comments: Array<RawComment | null>;

	SourceKey: string; // SourceKey
	sourceWidth: number;
	sourceHeight: number;

	Likes: number;
	Shares: number;

	sourceRatio: upload_source_ratio;
};

// reaction type based on reactions array
export type ReactionType = (typeof Reactions)[number];

// simple user interface
export interface CrahUser {
	name: string;
	avatar: string;
	_id: number;
	level?: number;
	rank?: number;
}

// when a user is selected in f.e a gifted chat
export interface selectedRiderInterface extends User {
	rank: Rank;
	rankPosition: number;
}

// when a trick is selected f.e in a gifted chat
export interface selectedTrickInterface {
	id: number;
	name: string;
	difficulty: TrickDifficulty;
	costum?: boolean;
}

// gifted chat footer attachment types
export type ChatFooterBarTypes = 'TrickRow' | 'RiderRow' | 'Source' | 'Audio';

// chat message for gifted chat
export interface ChatMessage extends IMessage {
	_id: string;
	isGroup: boolean;
	ChatId: string;
	ChatName: string;
	ChatAvatar: string | null;
	InitAboutSystemMessage: boolean;
	text: string;
	createdAt: Date;
	participants: User[];
	type: chatCostumMsgType;
	riderId: string;
	trickId: number;
	// reply to a message
	isReply: boolean;
	replyToMessageId: string | undefined;
	sourceData: PhotoFile | VideoFile; // meta data
}

// identify urls
export const urlRegex = /(https?:\/\/[^\s]+)/g;

// error type for error states when fetching from an api
export type errType = 'not found' | 'deleted' | undefined;

/*
	Users can let their comments rate from other users
	the most voted type for a comment is the displayed comment type on the comment row
*/

export enum CommentType {
	default = 'Default Comment',
	top = 'Top Comment',
	funny = 'Funny Comment',
	real = 'Real Comment',
}

/*
	Wether a comment is to the post or to another comment
*/

export type CommentPurpose = 'comment' | 'reply';

// JSOn structure of a comment
export type userCommentType = {
	user: CrahUser;
	avatar: string;
	text: string;
	_id: number;
	likes: number;
	createdAt: number | Date;
	type: CommentType;
	purpose: CommentPurpose;
	replyTo?: number; // if comment is from purpose "reply"
};

/*
	Third-party websites the user can log in through.
*/

export enum AuthStrategy {
	Google = 'oauth_google',
}

// chat typing status
export interface TypingStatus {
	userId: string;
	isTyping: boolean;
}

/*
	This enumeration lists all static endpoints without search parameters that the app fetches from the CRAH API.
*/

export enum fetchAdresses {
	commonTricks = 'http://192.168.0.136:4000/public/tricks/commonTricks.json',
	allUsers = 'http://192.168.0.136:4000/api/users/all',
	allPosts = 'http://192.168.0.136:4000/api/posts/all',
	allTricks = 'http://192.168.0.136:4000/public/tricks/commonTricks.json',
}

/*
	costum messgae type for a message in a gifted chat
*/

export enum chatCostumMsgType {
	rider = 'rider',
	trick = 'trick',
	text = 'text',
}

// when parsing image/video information from one component to the other
export interface sourceDataInterface {
	uri: string | undefined;
	type: 'image' | 'video';
}

// video data structure from vision-camera
export type VideoMeta = {
	path: string;
	width: number;
	height: number;
	duration: number;
};

/*
	Link preview fetched from server
*/

export interface LinkPreview {
	url: string;
	title: string;
	siteName: string;
	description: string;
	mediaType: string;
	contentType: string;
	images: string[];
	videos: string[];
	favicons: string[];
	charset: string;
}

/* 
	The generic drop down component follows a strict item structure
*/

export interface dropDownMenuInputData {
	key: number;
	text: string;
	iconIOS?: string;
	iconAndroid?: string;
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
	Types of posts a user can directly create
*/

export enum CreatePostType {
	video = 'Video',
	post = 'Post',
	article = 'Article',
}

// special types of messges the user can send in gifted chat
export type ItemText = 'Rider' | 'Trick';

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

// All icons for all post/search types
export enum PostTypeIonicons {
	all = 'albums-outline',
	videoLandscape = 'phone-landscape-outline',
	videoPortrait = 'phone-portrait-outline',
	text = 'chatbox-ellipses-outline',
	article = 'book-outline',
	image = 'images-outline',
}

// General user post types
export enum GeneralPostTypes {
	all = 'All posts',
	videos = 'Videos',
	text_images = 'Text',
	articles = 'Articles',
}

// General icons for user post types
export enum GeneralPostTypesIonicons {
	all = 'albums-outline',
	videos = 'videocam-outline',
	text_images = 'camera-outline',
	articles = 'book-outline',
}

/*
	Determines in which order the client displays user posts or other data search entries
*/
export enum ExplorePostOrder {
	toOldest = 'Latest to oldest',
	toLatest = 'Oldest to latest',
}

/* 
	ALl types of content the user can search for on the search page
	including non-post data like the people, stunt scooter riders
	and tricks
*/
export enum SearchCategories {
	allPosts = 'All posts',
	videos = 'Videos',
	articles = 'Articles',
	text = 'Text',
	riders = 'Riders',
	tricks = 'Tricks',
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

// when recieving chat meta data as a whole without its messages
export interface Chat {
	Id: string;
	IsGroup: number;
	Name: string; // group name or user avatar of other user
	Avatar: string; // group avatar or user avatar of other user
	LastMessageContent: string;
	LastMessageSenderId: string;
	LastMessageDate: Date;
	LastMessageType: chatCostumMsgType;
	UnreadCount: number;
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
	SmallDescription = 150,
	BigDescription = 800,
	Article = 10000,
}

/* 
	Tags the user can put underneath his post
*/

export enum Tags {
	Banger = 'Banger', // Highly engaging and attention-grabbing
	WorldsFirst = "World's First", // Unique and exclusive content
	WorldsSecond = "World's Second", // Still unique but slightly less exclusive
	News = 'News', // Timely and relevant information
	Challenge = 'Challenge', // Interactive and engaging
	Review = 'Review', // Informative and opinion-based
	Tutorial = 'Tutorial', // Educational and helpful
	Guide = 'Guide', // Step-by-step instructions
	Story = 'Story', // Personal and relatable content
	Opinion = 'Opinion', // Thought-provoking and discussion-worthy
	Thought = 'Thought', // Intellectual and reflective
	Experience = 'Experience', // Personal and relatable insights
	Information = 'Information', // General knowledge sharing
	Announcement = 'Announcement', // Important updates
	Reminder = 'Reminder', // Useful and actionable
	Warning = 'Warning', // Urgent and critical
	Advertisement = 'Advertisement', // Promotional content
	Documentation = 'Documentation', // Technical and detailed
	Question = 'Question', // Encourages interaction
	Answer = 'Answer', // Provides solutions
}

/* 
	Based on his five best tricks, the user gets categorized in a rank with other users
*/

export enum Rank {
	Wood = 'wood',
	Bronze = 'bronze',
	Silver = 'silver',
	Gold = 'gold',
	Platinum = 'platinum',
	Diamond = 'diamond',
	Epic = 'epic',
	Legendary = 'legendary',
}

export const RankColors: Record<Rank, string[]> = {
	[Rank.Wood]: ['#8B4513', '#A0522D'],
	[Rank.Bronze]: ['#CD7F32', '#B87333'],
	[Rank.Silver]: ['#C0C0C0', '#DCDCDC'],
	[Rank.Gold]: ['#FFD700', '#FFEC8B'],
	[Rank.Platinum]: ['#00CED1', '#E0FFFF'],
	[Rank.Diamond]: ['#B9F2FF', '#E0FFFF'],
	[Rank.Epic]: ['#9400D3', '#8A2BE2'],
	[Rank.Legendary]: ['#FFD700', '#FF4500'],
};

export const RankColorsDark: Record<Rank, string[]> = {
	[Rank.Wood]: ['#5C3310', '#704214'],
	[Rank.Bronze]: ['#8C5A28', '#A97142'],
	[Rank.Silver]: ['#A9A9A9', '#B0B0B0'],
	[Rank.Gold]: ['#B8860B', '#C9AE5D'],
	[Rank.Platinum]: ['#009EA0', '#B0DCDC'],
	[Rank.Diamond]: ['#7EC8E3', '#B0E0E6'],
	[Rank.Epic]: ['#6A0DAD', '#5B2C9F'],
	[Rank.Legendary]: ['#B8860B', '#CC3700'],
};

/* 
	A user can get multiple roles at once. A user role determines the user responsibilities.
	A user with no rank has no additonal responsibilities
*/

export enum UserRank {
	staff = 'Staff',
	verified = 'Verified',
	contributor = 'Contributor',
	OG = 'OG',
	sponsor = 'Sponsor',
}

export const UserRankColor = {
	[UserRank.staff]: '#E63946', // Kräftiges Rot für Autorität
	[UserRank.verified]: '#1D3557', // Edles Dunkelblau für Vertrauenswürdigkeit
	[UserRank.contributor]: '#F4A261', // Warmes Orange für Engagement
	[UserRank.OG]: '#2A9D8F', // Smaragdgrün für Veteranen
	[UserRank.sponsor]: '#FFD700', // Gold für Exklusivität
} as const;
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

export enum BestTrickType {
	FLAT = 'Flat',
	PARK = 'Park',
	STREET = 'Street',
}

export type TrickSpot = 'Flat' | 'Park' | 'Street';

// spot row data interface
export interface SpotInterface {
	spot: TrickSpot;
	landing_date: Date;
}

/*
	In what order a trick list should be displayed in a trick list
*/

export enum TrickListOrderTypes {
	DIFFICULTY = 'difficulty', // hardest first
	LANDEDFIRST = 'landed first', // tricks the user has landed first
	LANDEDLAST = 'landed last', // tricks the user has not landed first
}

/*
	What kind of tricks should be displayed in a trick list
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

/*
	In the create-video page the user has to upload a source from type video and a cover from type image
	see ImagePicker.types.ts from module expo-image-picker
	for the upload a modal is competent where the user has to choose between gallery and camera.
	The modal is being used for both the cover (image) and the source (video).
	The modal has to be given a parameter so it knows for what purpose an image shall be uploaded 
*/

export type modal_mode = 'Source' | 'Cover';

/*
	image-aspects the user can choose from to upload his video in
*/

export enum upload_source_ratio {
	SQUARE = '1:1',
	LANDSCAPE = '16:9',
	PORTRAIT = '9:16',
}

/*
	image-aspect as array type
*/

export const mediaTypeSourceRatio: Record<
	upload_source_ratio,
	[number, number]
> = {
	[upload_source_ratio.SQUARE]: [1, 1],
	[upload_source_ratio.LANDSCAPE]: [16, 9],
	[upload_source_ratio.PORTRAIT]: [9, 16],
} as const;

export interface AudioFile {
	path: string;
	duration: number;
	width: 0;
	height: 0;
}

/*
	help modal local parameter to deicde which content to display first to the user
*/
export enum helpPageTopcis {
	create = 'Create',
	ranks = 'Ranks',
	profile = 'Profile',
}

export enum helpPageParameter {
	createVideo = 'Create Video',
	createTextPost = 'Create Text, Post, Music',
	createArticle = 'Create Article',
	statsPages = 'Stats Pages',
	inbox = 'Inbox',
}

export type postTypes = 'Article' | 'Video' | 'Post' | 'Music';

export interface sourceMetadataInterface {
	type: postTypes;
	userId: string;
	data: any;
}
