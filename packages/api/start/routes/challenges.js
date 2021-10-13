/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable jsdoc/check-indentation */

const { getMiddlewarePermissions, permissions } = require('../../app/Utils/roles_capabilities');

const Route = use('Route');

Route.get('challenges', 'ChallengeController.index').middleware(['handleParams']);
Route.get('challenges/:id', 'ChallengeController.show').middleware(['handleParams']);
Route.post('challenges', 'ChallengeController.store')
	.middleware(['auth', 'registrationCompleted:check_personal_data'])
	.validator('StoreChallenge');
Route.put('challenges/:id', 'ChallengeController.update').middleware([
	'auth',
	getMiddlewarePermissions([permissions.UPDATE_CHALLENGE, permissions.UPDATE_CHALLENGES]),
]);
Route.delete('challenges/:id', 'ChallengeController.destroy').middleware([
	'auth',
	getMiddlewarePermissions([permissions.DELETE_CHALLENGE, permissions.DELETE_CHALLENGES]),
]);
