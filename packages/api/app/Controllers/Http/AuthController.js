/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const User = use('App/Models/User');
const Role = use('App/Models/Role');

class AuthController {
	/**
	 * Register an user.
	 *
	 * @param {object} ctx The content of the request
	 * @param {Request} ctx.request The HTTP request
	 *
	 * @returns {Response}
	 */
	async register({ request }) {
		const data = request.only(['username', 'email', 'password']);

		const user = await User.create(data);

		const defaultUserRole = await Role.query()
			.where('role', 'DEFAULT_USER')
			.first();

		await defaultUserRole.users().save(user);

		return {
			...user.toJSON(),
			password: '',
			role: defaultUserRole,
		};
	}

	/**
	 * Register an user.
	 *
	 * @param {object} ctx The content of the request
	 * @param {Request} ctx.request The HTTP request
	 * @param {object} ctx.auth The Auth object.
	 *
	 * @returns {Response}
	 */
	auth({ request, auth }) {
		const { email, password } = request.all();

		return auth.attempt(email, password);
	}
}

module.exports = AuthController;
