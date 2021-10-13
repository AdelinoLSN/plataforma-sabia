const Challenge = use('App/Models/Challenge');
const Term = use('App/Models/Term');
const { getTransaction, errorPayload, errors, Algolia } = require('../../Utils');

const algoliaIndexName = 'challenge';

async function algoliaPopulatedQuery(id) {
	return Challenge.query()
		.populateForAlgolia(id)
		.first();
}

class ChallengeController {
	async index({ request }) {
		const filters = request.all();
		return Challenge.query()
			.with('keywords')
			.withFilters(filters)
			.withParams(request);
	}

	async show({ request }) {
		return Challenge.query()
			.with('keywords')
			.withParams(request);
	}

	async syncronizeTerms(trx, keywords, challenge, detach = false) {
		const keywordInstances = await Promise.all(
			keywords.map((keyword) => Term.getTerm(keyword)),
		);
		if (detach) {
			await challenge.terms().detach(null, null, trx);
		}

		await challenge.terms().attach(
			keywordInstances.map((keyword) => keyword.id),
			null,
			trx,
		);
	}

	async store({ auth, request }) {
		const { title, description, keywords } = request.all();
		const challengeOwner = await auth.getUser();
		let challenge;
		let trx;
		try {
			const { init, commit } = getTransaction();
			trx = await init();

			challenge = await Challenge.create({ title, description }, trx);
			await challenge.user().associate(challengeOwner, trx);
			if (keywords) {
				await this.syncronizeTerms(trx, keywords, challenge);
			}
			await challenge.load('terms');

			await commit();
			await Algolia.handleObject.save(
				algoliaIndexName,
				await algoliaPopulatedQuery(challenge.id),
			);
		} catch (error) {
			await trx.rollback();
			throw error;
		}

		return challenge;
	}

	async update({ params, request }) {
		const data = request.only(['title', 'description']);
		const challenge = await Challenge.findOrFail(params.id);
		challenge.merge(data);
		let trx;
		try {
			const { init, commit } = getTransaction();
			trx = await init();

			await challenge.save(trx);

			const { keywords } = request.only(['keywords']);
			if (keywords) {
				await this.syncronizeTerms(trx, keywords, challenge, true);
			}
			await challenge.load('terms');

			await commit();
			await Algolia.handleObject.save(
				algoliaIndexName,
				await algoliaPopulatedQuery(challenge.id),
			);
		} catch (error) {
			await trx.rollback();
			throw error;
		}

		return challenge;
	}

	async destroy({ params, request, response }) {
		const challenge = await Challenge.findOrFail(params.id);
		// detaches related entities
		await challenge.terms().detach();
		const result = await challenge.delete();

		if (!result) {
			return response
				.status(400)
				.send(
					errorPayload(
						errors.RESOURCE_DELETED_ERROR,
						request.antl('error.resource.resourceDeletedError'),
					),
				);
		}

		await Algolia.handleObject.remove(algoliaIndexName, challenge.toJSON().objectID);
		return response.status(200).send({ success: true });
	}
}

module.exports = ChallengeController;
