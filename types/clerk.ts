type ClerkUser = {
	id: string;
	passwordEnabled: boolean;
	totpEnabled: boolean;
	backupCodeEnabled: boolean;
	twoFactorEnabled: boolean;
	createdAt: Date | null;
	updatedAt: Date | null;
	imageUrl: string;
	hasImage: boolean;
	primaryEmailAddressId: string | null;
	primaryPhoneNumberId: string | null;
	primaryWeb3WalletId: string | null;
	lastSignInAt: Date | null;
	externalId: string | null;
	username: string | null;
	firstName: string | null;
	lastName: string | null;
	publicMetadata: Record<string, unknown>;
	unsafeMetadata: Record<string, unknown>;
	// emailAddresses: EmailAddress[];
	// phoneNumbers: string[];
	// web3Wallets: string[];
	// externalAccounts: string[];
	// samlAccounts: string[];
	lastActiveAt?: number;
	createOrganizationEnabled: boolean;
	createOrganizationsLimit: number | null;
	deleteSelfEnabled: boolean;
	legalAcceptedAt?: number | null;
	_raw?: RawUser;
};

export type EmailAddress = {
	id: string;
	emailAddress: string;
	verification: Verification;
	linkedTo: string[];
};

export type Verification = {
	status: string;
	strategy: string;
	externalVerificationRedirectURL: string | null;
	attempts: number;
	expireAt: number;
	nonce: string | null;
	message: string | null;
};

export type RawUser = {
	id: string;
	object: string;
	username: string;
	first_name: string | null;
	last_name: string | null;
	image_url: string;
	has_image: boolean;
	primary_email_address_id: string;
	primary_phone_number_id: string | null;
	primary_web3_wallet_id: string | null;
	password_enabled: boolean;
	two_factor_enabled: boolean;
	totp_enabled: boolean;
	backup_code_enabled: boolean;
	email_addresses: RawEmailAddress[];
	phone_numbers: string[];
	web3_wallets: string[];
	passkeys: string[];
	external_accounts: string[];
	saml_accounts: string[];
	enterprise_accounts: string[];
	public_metadata: Record<string, unknown>;
	private_metadata: Record<string, unknown>;
	unsafe_metadata: Record<string, unknown>;
	external_id: string | null;
	last_sign_in_at: number;
	banned: boolean;
	locked: boolean;
	lockout_expires_in_seconds: number | null;
	verification_attempts_remaining: number;
	created_at: number;
	updated_at: number;
	delete_self_enabled: boolean;
	create_organization_enabled: boolean;
	last_active_at: number;
	mfa_enabled_at: number | null;
	mfa_disabled_at: number | null;
	legal_accepted_at: number | null;
	profile_image_url: string;
};

export type RawEmailAddress = {
	id: string;
	object: string;
	email_address: string;
	reserved: boolean;
	verification: {
		status: string;
		strategy: string;
		attempts: number;
		expire_at: number;
	};
	linked_to: string[];
	matches_sso_connection: boolean;
	created_at: number;
	updated_at: number;
};

export default ClerkUser;
