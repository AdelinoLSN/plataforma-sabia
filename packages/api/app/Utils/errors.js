const ERRORS_CODE = {
	INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
	VALIDATION_ERROR: 'VALIDATION_ERROR',
	INVALID_EMAIL: 'INVALID_EMAIL',
	UNVERRIFIED_EMAIL: 'UNVERIFIED_EMAIL',
	ALREADY_VERIFIED_EMAIL: 'ALREADY_VERIFIED_EMAIL',
	INVALID_TOKEN: 'INVALID_TOKEN',
	EXPIRED_TOKEN: 'EXPIRED_TOKEN',
	MISSING_DEFAULT_ROLE: 'MISSING_DEFAULT_ROLE',
	RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
	RESOURCE_DELETED_ERROR: 'RESOURCE_DELETED_ERROR',
};

module.exports.errorPayload = (code, message) => {
	return {
		error: {
			error_code: code,
			message,
		},
	};
};

module.exports.errors = ERRORS_CODE;
