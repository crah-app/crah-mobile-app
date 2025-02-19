export enum AuthStrategy {
  Google = 'oauth_google',
}

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

export type PostType = keyof typeof PostTypes;
