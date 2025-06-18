export type BodyType = 'halfbody' | 'fullbody';

export type Language =
	| 'en'
	| 'en-IE'
	| 'de'
	| 'fr'
	| 'es'
	| 'es-MX'
	| 'it'
	| 'pt'
	| 'pt-BR'
	| 'tr'
	| 'ja'
	| 'kr'
	| 'ch';

export type AvatarCreatorConfig = {
	clearCache?: boolean;
	bodyType?: BodyType;
	quickStart?: boolean;
	language?: Language;
};

/**
 * These are some of the parameters to fetch custom 2D Avatar image
 * More info about rest of parameters is available here:
 *
 * https://docs.readyplayer.me/ready-player-me/api-reference/rest-api/avatars/get-2d-avatars
 */
export type Avatar2DConfig = {
	expression?: 'happy' | 'lol' | 'sad' | 'scared' | 'rage';
	pose?: 'power-stance' | 'relaxed' | 'standing' | 'thumbs-up';
	camera?: 'fullbody' | 'portrait';
};

export type IFrameEvent<TPayload> = {
	eventName?: string;
	source?: string;
	data: TPayload;
};

export type AvatarExportedEventPayload = {
	url: string;
	avatarId: string;
	userId: string;
};

export type AvatarExportedEvent = IFrameEvent<AvatarExportedEventPayload>;

export type AssetUnlockedEventPayload = {
	userId: string;
	assetId: string;
};

export type AssetUnlockedEvent = IFrameEvent<AssetUnlockedEventPayload>;

export type UserAuthorizedEventPayload = {
	id: string;
};

export type UserAuthorizedEvent = IFrameEvent<UserAuthorizedEventPayload>;

export type UserSetEventPayload = {
	id: string;
};

export type UserSetEvent = IFrameEvent<UserSetEventPayload>;

export type UserUpdatedEventPayload = {
	id: string;
};

export type UserUpdatedEvent = IFrameEvent<UserUpdatedEventPayload>;
export type UserLoggedOutEvent = IFrameEvent<never>;

export type AvatarCreatorEvent =
	| UserSetEvent
	| AssetUnlockedEvent
	| UserAuthorizedEvent
	| AvatarExportedEvent
	| UserUpdatedEvent
	| UserLoggedOutEvent;
