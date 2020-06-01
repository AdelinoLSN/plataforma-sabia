/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
const dayjs = require('dayjs');

const User = use('App/Models/User');

const Role = use('App/Models/Role');

const Mail = use('Adonis/Addons/Mail');
const Config = use('Adonis/Src/Config');
const Token = use('App/Models/Token');

const { antl, errors, errorPayload } = require('../../Utils');

class AuthController {
	/**
	 * Register an user.
	 *
	 * @param {object} ctx The content of the request
	 * @param {Request} ctx.request The HTTP request
	 *
	 * @returns {Response}
	 */
	async sendEmailConfirmation({ user, scope }) {
		const { adminURL, webURL } = Config.get('app');
		const { from } = Config.get('mail');

		await user
			.tokens('type', 'confirm_ac')
			.where('is_revoked', false)
			.update({ is_revoked: true })
			.save();

		const { token } = await user.generateToken('confirm-ac');

		await Mail.send(
			'emails.confirm-account',
			{
				user,
				token,
				url:
					scope === 'admin'
						? `${adminURL}/auth/confirm-account/`
						: `${webURL}/auth/confirmAccount`,
			},
			(message) => {
				message
					.to(user.email)
					.from(from)
					.subject(antl('message.auth.confirmAccountEmailSubject'));
			},
		);
	}

	async register({ request }) {
		const { full_name, scope } = request.only(['full_name', 'scope']);
		let data = request.only(['first_name', 'last_name', 'email', 'password']);

		if (full_name) {
			const fullNameArray = full_name.split(' ');

			data = {
				...data,
				first_name: fullNameArray[0],
				last_name: fullNameArray[fullNameArray.length - 1],
			};
		}

		const defaultUserRole = await Role.getDefaultUserRole();

		const user = await User.create(data);
		await user.role().associate(defaultUserRole);
		await user.load('role');
		this.sendEmailConfirmation({ user, scope });

		return {
			...user.toJSON(),
			password: '',
		};
	}

	async confirmAccount({ request, response }) {
		const { token, scope } = request.only(['token', 'scope']);
		const { adminURL, webURL } = Config.get('app');
		const { from } = Config.get('mail');

		const tokenObject = await Token.query()
			.where('token', token)
			.where('type', 'confirm-ac')
			.where('is_revoked', false)
			.where(
				'created_at',
				'>=',
				dayjs()
					.subtract(24, 'hour')
					.format('YYYY-MM-DD HH:mm:ss'),
			)
			.first();

		if (!tokenObject) {
			return response
				.status(401)
				.send(errorPayload(errors.INVALID_TOKEN, antl('error.auth.invalidToken')));
		}

		await tokenObject.revoke();

		const user = await tokenObject.user().fetch();

		user.status = 'verified';
		await user.save();

		await Mail.send(
			'emails.active-account',
			{
				user,
				url: scope === 'admin' ? adminURL : webURL,
			},
			(message) => {
				message.subject(antl('message.auth.accountActivatedEmailSubject'));
				message.from(from);
				message.to(user.email);
			},
		);

		return response.status(200).send({ success: true });
	}

	/**
	 * Register a confirmation e-mail.
	 *
	 * @param {Request} ctx.request The HTTP request
	 *
	 * @returns {Response}
	 */

	async resendConfirmationEmail({ request, response }) {
		const { email, scope } = request.only(['email', 'scope']);
		const user = await User.findBy('email', email);

		if (user.status !== 'pending') {
			return response.status(200).send({ success: true });
		}

		this.sendEmailConfirmation({ user, scope });

		return response.status(200).send({ success: true });
	}

	/**
	 * Authenticate an user.
	 *
	 * @param {object} ctx The content of the request
	 * @param {Request} ctx.request The HTTP request
	 * @param {object} ctx.auth The Auth object.
	 *
	 * @returns {Response}
	 */
	async auth({ request, auth, response }) {
		const { email, password } = request.only(['email', 'password']);

		try {
			const user = await User.findBy('email', email);
			if (user.status === 'pending') {
				return response
					.status(400)
					.send(
						errorPayload(errors.UNVERIFIED_EMAIL, antl('error.auth.unverifiedEmail')),
					);
			}
		} catch (error) {
			return response
				.status(401)
				.send(
					errorPayload(errors.INVALID_CREDENTIALS, antl('error.auth.invalidCredentials')),
				);
		}

		const token = await auth.attempt(email, password);
		return token;
	}

	/**
	 * Method to handle restting passwords.
	 *
	 * @param {object} ctx The content of the request
	 * @param {Request} ctx.request The HTTP request
	 * @param {object} ctx.auth The Auth object.
	 *
	 * @returns {Response}
	 */
	async forgotPassword({ request, response }) {
		const { email, scope } = request.all();

		const user = await User.findBy('email', email);

		if (!user) {
			return response
				.status(400)
				.send(errorPayload(errors.INVALID_EMAIL, antl('error.email.invalid')));
		}

		await user
			.tokens('type', 'reset-pw')
			.where('is_revoked', false)
			.update({ is_revoked: true });

		const { token } = await user.generateToken('reset-pw');
		const { adminURL, webURL } = Config.get('app');
		const { from } = Config.get('mail');

		await Mail.send(
			'emails.forgot-password',
			{
				user,
				token,
				url:
					scope === 'admin'
						? `${adminURL}#/auth/reset-password`
						: `${webURL}/auth/reset-password`,
			},
			(message) => {
				message.subject(antl('message.auth.passwordRecoveryEmailSubject'));
				message.from(from);
				message.to(user.email);
			},
		);

		return response.status(200).send({ success: true });
	}

	/**
	 * Resets a password through a token
	 *
	 * @param {object} ctx The content of the request
	 * @param {Request} ctx.request The HTTP request
	 * @param {object} ctx.auth The Auth object.
	 *
	 * @returns {Response}
	 */
	async resetPassword({ request, response }) {
		const { token, password } = request.all();
		const { from } = Config.get('mail');

		const tokenObject = await Token.query()
			.where('token', token)
			.where('is_revoked', false)
			.where(
				'created_at',
				'>=',
				dayjs()
					.subtract(24, 'hour')
					.format('YYYY-MM-DD HH:mm:ss'),
			)
			.first();

		if (!tokenObject || tokenObject.type !== 'reset-pw') {
			return response
				.status(401)
				.send(errorPayload(errors.INVALID_TOKEN, antl('error.auth.invalidToken')));
		}

		await tokenObject.revoke();

		const user = await tokenObject.user().fetch();
		user.merge({ password });
		await user.save();

		await Mail.send('emails.reset-password', { user }, (message) => {
			message.subject(antl('message.auth.passwordChangedEmailSubject'));
			message.from(from);
			message.to(user.email);
		});

		return response.status(200).send({ success: true });
	}

	/**
	 * Returns the current logged in user.
	 *
	 * @param {object} ctx The content of the request
	 * @param {Request} ctx.request The HTTP request
	 * @param {object} ctx.auth The Auth object.
	 *
	 * @returns {Response}
	 */
	async getMe({ auth }) {
		const user = await auth.getUser();

		return {
			...user.toJSON(),
			password: '',
		};
	}
}

module.exports = AuthController;
