/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable jsdoc/check-indentation */

const { getMiddlewarePermissions, permissions } = require('../../app/Utils/roles_capabilities');

const Route = use('Route');

/**
 * @api {get} /challenges Lists All Challenges
 * @apiGroup Challenges
 * @apiParam (Query Param) {Number[]} [keywords] Filters by keyword list.
 * @apiParam (Query Param) {String} [title] Filters by title
 * @apiParam (Query Param) {String} [description] Filters by description
 * @apiUse Params
 * @apiParamExample  {json} Request sample:
 * GET /challenges?keywords=104,95
 * @apiSuccess {Object[]} challenges Challenge Collection
 * @apiSuccess {Number} challenges.challenges.id challenge ID.
 * @apiSuccess {Number} challenges.user_id User ID.
 * @apiSuccess {String} challenges.title Challenge title.
 * @apiSuccess {String} challenges.description Challenge description.
 * @apiSuccess {Date} challenges.created_at Challenge Register date
 * @apiSuccess {Date} challenges.updated_at Challenge Update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 *	[
 *	 	{
 *	 	  "id": 21,
 *	 	  "title": "Lu mej du ehabuberi fig.",
 *	 	  "description": "Lag tofe od hevo ohuvuzu vekijih pitetodo nakkekud so unocam.",
 *	 	  "user_id": 3,
 *	 	  "created_at": "2020-12-01 16:40:17",
 *	 	  "updated_at": "2020-12-01 16:40:17"
 *	 	},
 *	 	{
 *	 	  "id": 37,
 *	 	  "title": "Fimuhmu adnicuj fucese elo kismujoz.",
 *	 	  "description": "Sefofi bi mumadkef bitaw megcevej huj jisub wa na mudmitraw.",
 *	 	  "user_id": 21,
 *	 	  "created_at": "2020-12-01 16:56:32",
 *	 	  "updated_at": "2020-12-01 16:56:32"
 *	 	},
 *	 	{
 *	 	  "id": 49,
 *	 	  "title": "Cejacmo weisva ubuwupa awajen re.",
 *	 	  "description": "Fubi sew apbo cogi ca su ho fagu ohlokluw go.",
 *	 	  "user_id": 1,
 *	 	  "created_at": "2020-12-01 16:56:32",
 *	 	  "updated_at": "2020-12-01 16:56:32"
 *	 	},
 *	 	{
 *	 	  "id": 55,
 *	 	  "title": "Besev uw dafwam cimarzo cuczeca.",
 *	 	  "description": "Rivodoj paweg cat tazuj soonubon ducvagal go ot goza zarigaw.",
 *	 	  "user_id": 22,
 *	 	  "created_at": "2020-12-01 16:56:32",
 *	 	  "updated_at": "2020-12-01 16:56:32"
 *	 	},
 *	 	{
 *	 	  "id": 60,
 *	 	  "title": "Jena vip bualu ikahu asweeru.",
 *	 	  "description": "Se ercejwa onikibe ab nibat suski jovticpu jahemzo zatu weczisji.",
 *	 	  "user_id": 18,
 *	 	  "created_at": "2020-12-01 16:56:32",
 *	 	  "updated_at": "2020-12-01 16:56:32"
 *	 	}
 *	]
 */
Route.get('challenges', 'ChallengeController.index').middleware(['handleParams']);
/**
 * @api {get} /challenges/:id Gets an single challenge
 * @apiGroup Challenges
 * @apiUse Params
 * @apiParamExample  {json} Request sample:
 * GET /challenges/1
 * @apiSuccess {Number} id challenge ID.
 * @apiSuccess {Number} user_id User ID.
 * @apiSuccess {String} title Challenge title.
 * @apiSuccess {String} description Challenge description.
 * @apiSuccess {Date} created_at Challenge Register date
 * @apiSuccess {Date} updated_at Challenge Update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 *	{
 *	 "id": 1,
 *	 "title": "Se ercejwa onikibe ab nibat suski",
 *	 "description": "Polru juz co wicenab saj ladu zeuwo pulra ba ruop.",
 *	 "user_id": 3,
 *	 "created_at": "2020-12-01 16:40:17",
 *	 "updated_at": "2020-12-01 16:40:17"
 *	}
 * @apiError (Bad Request 400) {Object} error Error object
 * @apiError (Bad Request 400) {String} error.error_code Error code
 * @apiError (Bad Request 400) {String} error.message Error message
 * @apiErrorExample {json} Resource Challenge was not found
 *    HTTP/1.1 400 Bad Request
 *		{
 * 			"error": {
 *   			"error_code": "RESOURCE_NOT_FOUND",
 *   			"message":"The resource Challenge was not found"
 * 			}
 *		}
 */
Route.get('challenges/:id', 'ChallengeController.show').middleware(['handleParams']);
/**
 * @api {post} /challenges Creates a new challenge
 * @apiGroup Challenges
 * @apiHeader {String} Authorization Authorization Bearer Token.
 * @apiHeaderExample {json} Header-Example:
 *    {
 *      "Authorization": "Bearer <token>"
 *    }
 * @apiParam {String} title Mandatory Challenge title
 * @apiParam {String} description Mandatory Challenge description
 * @apiParam {Number[]|String[]} keywords Keyword Array, can be ID or slug
 * @apiSuccess {Number} id challenge ID.
 * @apiSuccess {Number} user_id User ID.
 * @apiSuccess {String} title Challenge title.
 * @apiSuccess {String} description Challenge description.
 * @apiSuccess {Date} created_at Challenge Register date
 * @apiSuccess {Date} updated_at Challenge Update date
 * @apiSuccess {Object[]} challenge.terms Terms Collection
 * @apiSuccess {Number} challenge.terms.id Term ID
 * @apiSuccess {String} challenge.terms.taxonomy_id Taxonomy ID
 * @apiSuccess {String} challenge.terms.parent_id Parent ID
 * @apiSuccess {String} challenge.terms.term Term
 * @apiSuccess {String} challenge.terms.slug Term Slug
 * @apiSuccess {Date} challenge.terms.created_at Term Register date
 * @apiSuccess {Date} challenge.terms.updated_at Term Update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 *	{
 *	 "id": 62,
 *	 "title": "Wonderful challenge",
 *	 "description": "One advanced diverted domestic sex repeated bringing you old. Possible procured her trifling laughter thoughts property she met way. Companions shy had solicitude favourable own. Which could saw guest man now heard but. Lasted my coming uneasy marked so should. Gravity letters it amongst herself dearest an windows by. Wooded ladies she basket season age her uneasy saw. Discourse unwilling am no described dejection incommode no listening of. Before nature his parish boy.",
 *	 "user_id": 1,
 *	 "created_at": "2020-12-03 13:18:07",
 *	 "updated_at": "2020-12-03 13:18:07",
 *	 "terms": [
 *	   {
 *	     "id": 234,
 *	     "term": "edatinputuowwu",
 *	     "slug": "edatinputuowwu",
 *	     "parent_id": null,
 *	     "taxonomy_id": 2,
 *	     "created_at": "2020-11-17 20:52:54",
 *	     "updated_at": "2020-11-17 20:52:55",
 *	     "pivot": {
 *	       "term_id": 234,
 *	       "challenge_id": 62
 *	     }
 *	   },
 *	   {
 *	     "id": 235,
 *	     "term": "peodeparokoto",
 *	     "slug": "peodeparokoto",
 *	     "parent_id": null,
 *	     "taxonomy_id": 2,
 *	     "created_at": "2020-11-17 20:52:54",
 *	     "updated_at": "2020-11-17 20:52:55",
 *	     "pivot": {
 *	       "term_id": 235,
 *	       "challenge_id": 62
 *	     }
 *	   },
 *	   {
 *	     "id": 88,
 *	     "term": "omcisisanokut",
 *	     "slug": "omcisisanokut",
 *	     "parent_id": null,
 *	     "taxonomy_id": 2,
 *	     "created_at": "2020-11-17 20:52:54",
 *	     "updated_at": "2020-11-17 20:52:55",
 *	     "pivot": {
 *	       "term_id": 88,
 *	       "challenge_id": 62
 *	     }
 *	   }
 *	 ]
 *	}
 * @apiUse AuthError
 * @apiError (Forbidden 403) {Object} error Error object
 * @apiError (Forbidden 403) {String} error.error_code Error code
 * @apiError (Forbidden 403) {String} error.message Error message
 * @apiErrorExample {json} Uncompleted Registration
 *    HTTP/1.1 403 Forbidden
 *		{
 * 			"error": {
 *   			"error_code": "REGISTRATION_UNCOMPLETED",
 *   			"message":"You need to complete your registration to access this resource"
 * 			}
 *		}
 * @apiError (Bad Request 400) {Object} error Error object
 * @apiError (Bad Request 400) {String} error.error_code Error code
 * @apiError (Bad Request 400) {String} error.message Error message
 * @apiErrorExample {json} Validation Error: title Required
 *    HTTP/1.1 400 Bad Request
 *		{
 *    		"error": {
 *        		"error_code": "VALIDATION_ERROR",
 *        		"message": [
 *            		{
 *                		"message": "title is required.",
 *                		"field": "title",
 *                		"validation": "required"
 *            		}
 *        		]
 *   		}
 *		}
 *@apiErrorExample {json} Validation Error: description Required
 *    HTTP/1.1 400 Bad Request
 *		{
 *    		"error": {
 *        		"error_code": "VALIDATION_ERROR",
 *        		"message": [
 *            		{
 *                		"message": "description is required.",
 *                		"field": "description",
 *                		"validation": "required"
 *            		}
 *        		]
 *   		}
 *		}
 *@apiErrorExample {json} Validation Error: keywords Required
 *    HTTP/1.1 400 Bad Request
 *		{
 *    		"error": {
 *        		"error_code": "VALIDATION_ERROR",
 *        		"message": [
 *            		{
 *                		"message": "keywords is required.",
 *                		"field": "keywords",
 *                		"validation": "required"
 *            		}
 *        		]
 *   		}
 *		}
 * @apiError (Forbidden 403) {Object} error Error object
 * @apiError (Forbidden 403) {String} error.error_code Error code
 * @apiError (Forbidden 403) {String} error.message Error message
 * @apiErrorExample {json} Registration Uncompleted
 *    HTTP/1.1 403 Forbidden
 *		{
 * 			"error": {
 *   			"error_code": "REGISTRATION_UNCOMPLETED",
 *   			"message":"You need to complete your registration to access this resource. Uncompleted Fields: {Uncompleted fields}"
 * 			}
 *		}
 */
Route.post('challenges', 'ChallengeController.store')
	.middleware(['auth', 'registrationCompleted:check_personal_data'])
	.validator('StoreChallenge');
/**
 * @api {put} /challenges/:id Updates an challenge
 * @apiGroup Challenges
 * @apiPermission UPDATE_IDEA
 * @apiHeader {String} Authorization Authorization Bearer Token.
 * @apiHeaderExample {json} Header-Example:
 *    {
 *      "Authorization": "Bearer <token>"
 *    }
 * @apiParam {String} [title] Challenge title
 * @apiParam {String} [description] Challenge description
 * @apiParam {Number[]|String[]} [keywords] Keyword Array, can be ID or slug
 * @apiSuccess {Number} id challenge ID.
 * @apiSuccess {Number} user_id User ID.
 * @apiSuccess {String} title Challenge title.
 * @apiSuccess {String} description Challenge description.
 * @apiSuccess {Date} created_at Challenge Register date
 * @apiSuccess {Date} updated_at Challenge Update date
 * @apiSuccess {Object[]} challenge.terms Terms Collection
 * @apiSuccess {Number} challenge.terms.id Term ID
 * @apiSuccess {String} challenge.terms.taxonomy_id Taxonomy ID
 * @apiSuccess {String} challenge.terms.parent_id Parent ID
 * @apiSuccess {String} challenge.terms.term Term
 * @apiSuccess {String} challenge.terms.slug Term Slug
 * @apiSuccess {Date} challenge.terms.created_at Term Register date
 * @apiSuccess {Date} challenge.terms.updated_at Term Update date
 * @apiSuccessExample {json} Success
 * HTTP/1.1 200 OK
 *	{
 *	 "id": 62,
 *	 "title": "Wonderful challenge Updated",
 *	 "description": "One advanced diverted domestic sex repeated bringing you old. Possible procured her trifling laughter thoughts property she met way. Companions shy had solicitude favourable own. Which could saw guest man now heard but. Lasted my coming uneasy marked so should. Gravity letters it amongst herself dearest an windows by. Wooded ladies she basket season age her uneasy saw. Discourse unwilling am no described dejection incommode no listening of. Before nature his parish boy.",
 *	 "user_id": 1,
 *	 "created_at": "2020-12-03 13:18:07",
 *	 "updated_at": "2020-12-03 13:18:07",
 *	 "terms": [
 *	   {
 *	     "id": 234,
 *	     "term": "edatinputuowwu",
 *	     "slug": "edatinputuowwu",
 *	     "parent_id": null,
 *	     "taxonomy_id": 2,
 *	     "created_at": "2020-11-17 20:52:54",
 *	     "updated_at": "2020-11-17 20:52:55",
 *	     "pivot": {
 *	       "term_id": 234,
 *	       "challenge_id": 62
 *	     }
 *	   },
 *	   {
 *	     "id": 235,
 *	     "term": "peodeparokoto",
 *	     "slug": "peodeparokoto",
 *	     "parent_id": null,
 *	     "taxonomy_id": 2,
 *	     "created_at": "2020-11-17 20:52:54",
 *	     "updated_at": "2020-11-17 20:52:55",
 *	     "pivot": {
 *	       "term_id": 235,
 *	       "challenge_id": 62
 *	     }
 *	   },
 *	   {
 *	     "id": 88,
 *	     "term": "omcisisanokut",
 *	     "slug": "omcisisanokut",
 *	     "parent_id": null,
 *	     "taxonomy_id": 2,
 *	     "created_at": "2020-11-17 20:52:54",
 *	     "updated_at": "2020-11-17 20:52:55",
 *	     "pivot": {
 *	       "term_id": 88,
 *	       "challenge_id": 62
 *	     }
 *	   }
 *	 ]
 *	}
 * @apiUse AuthError
 * @apiError (Forbidden 403) {Object} error Error object
 * @apiError (Forbidden 403) {String} error.error_code Error code
 * @apiError (Forbidden 403) {String} error.message Error message
 * @apiErrorExample {json} Unauthorized Access
 *    HTTP/1.1 403 Forbidden
 *		{
 * 			"error": {
 *   			"error_code": "UNAUTHORIZED_ACCESS",
 *   			"message":"Você não tem permissão para acessar esse recurso"
 * 			}
 *		}
 * @apiError (Bad Request 400) {Object} error Error object
 * @apiError (Bad Request 400) {String} error.error_code Error code
 * @apiError (Bad Request 400) {String} error.message Error message
 * @apiErrorExample {json} Resource Challenge was not found
 *    HTTP/1.1 400 Bad Request
 *		{
 * 			"error": {
 *   			"error_code": "RESOURCE_NOT_FOUND",
 *   			"message":"The resource Challenge was not found"
 * 			}
 *		}
 */
Route.put('challenges/:id', 'ChallengeController.update').middleware([
	'auth',
	getMiddlewarePermissions([permissions.UPDATE_CHALLENGE, permissions.UPDATE_CHALLENGES]),
]);
/**
 * @api {delete} /challenges/:id Deletes an Challenge
 * @apiGroup Challenges
 * @apiPermission DELETE_IDEA
 * @apiHeader {String} Authorization Authorization Bearer Token.
 * @apiHeaderExample {json} Header-Example:
 *    {
 *      "Authorization": "Bearer <token>"
 *    }
 * @apiParam (Route Param) {Number} id Mandatory Challenge ID.
 * @apiParamExample  {json} Request sample:
 * DELETE /challenges/1
 * @apiSuccess {Boolean} success Success Flag
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *		"success":"true"
 *    }
 * @apiUse AuthError
 * @apiError (Forbidden 403) {Object} error Error object
 * @apiError (Forbidden 403) {String} error.error_code Error code
 * @apiError (Forbidden 403) {String} error.message Error message
 * @apiErrorExample {json} Unauthorized Access
 *    HTTP/1.1 403 Forbidden
 *		{
 * 			"error": {
 *   			"error_code": "UNAUTHORIZED_ACCESS",
 *   			"message":"Você não tem permissão para acessar esse recurso"
 * 			}
 *		}
 * @apiErrorExample {json} Resource Challenge was not found
 *    HTTP/1.1 400 Bad Request
 *		{
 * 			"error": {
 *   			"error_code": "RESOURCE_NOT_FOUND",
 *   			"message":"The resource Challenge was not found"
 * 			}
 *		}
 */
Route.delete('challenges/:id', 'ChallengeController.destroy').middleware([
	'auth',
	getMiddlewarePermissions([permissions.DELETE_CHALLENGE, permissions.DELETE_CHALLENGES]),
]);
