/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

const { roles } = require('../Utils/roles_capabilities');

class Challenge extends Model {
	static boot() {
		super.boot();
		this.addTrait('Params');
	}

	/**
	 * Runs the term query with the provided filters.
	 *
	 * @param {object} query The query object.
	 * @param {object} filters The query filters
	 *
	 * @returns {object}
	 */
	static scopeWithFilters(query, filters) {
		if (filters.title) {
			query.where('title', 'LIKE', `%${filters.title}%`);
		}
		if (filters.description) {
			query.where('description', 'LIKE', `%${filters.description}%`);
		}

		if (filters.keywords) {
			const keywordsList = filters?.keywords.split(',') || [];
			if (keywordsList.length) {
				query.whereHas('terms', (builder) => {
					builder.whereIn('id', keywordsList);
				});
			}
		}

		return query;
	}

	/**
	 * Query scope to get the published tecnologies
	 *
	 * @param {object} query The query object.
	 * @param {object} user User object
	 * @param {string} userRole User Role
	 * @returns {object}
	 */
	static scopeAvailable(query, user = null, userRole = null) {
		if (!user || userRole !== roles.ADMIN) {
			return query.where({ status: 'approved' });
		}
		return query;
	}

	static scopePopulateForAlgolia(query, id) {
		if (id) {
			query.where({ id });
		}

		query.with('keywords').with('user');

		return query;
	}

	static get computed() {
		return ['objectID'];
	}

	getObjectId({ id }) {
		return `challenge-${id}`;
	}

	user() {
		return this.belongsTo('App/Models/User');
	}

	terms() {
		return this.belongsToMany('App/Models/Term');
	}

	keywords() {
		return this.belongsToMany('App/Models/Term').withFilters({ taxonomy: 'keywords' });
	}

	static async isChallengeApproved(challenge) {
		return challenge.status === 'approved';
	}

	async checkOwner(user) {
		return user.id === this.user_id;
	}

	static async canAccessUnApprovedChallenge(challenge, user) {
		const userRole = await user.getRole();
		if (userRole === roles.ADMIN) return true;

		const isOwner = await challenge.checkOwner(user);
		if (isOwner) return true;

		return false;
	}
}

module.exports = Challenge;
