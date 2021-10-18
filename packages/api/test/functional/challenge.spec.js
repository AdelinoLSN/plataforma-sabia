const { trait, test, beforeEach } = use('Test/Suite')('Challenge');
const AlgoliaSearch = use('App/Services/AlgoliaSearch');
const Challenge = use('App/Models/Challenge');
const Taxonomy = use('App/Models/Taxonomy');
const Factory = use('Factory');
const { errorPayload, errors, antl } = require('../../app/Utils');
const { createUser } = require('../utils/Suts');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

beforeEach(async () => {
	await AlgoliaSearch.sandbox.reset();
});

test('GET /challenges returns all challenges', async ({ client }) => {
	const response = await client.get('/challenges').end();
	const challenges = await Challenge.query()
		.limit(10)
		.fetch();

	response.assertStatus(200);
	response.assertJSONSubset(challenges.toJSON());
});

test('GET /challenges/:id returns an challenge', async ({ client }) => {
	const user = await Factory.model('App/Models/User').create();
	const challenge = await Factory.model('App/Models/Challenge').create({
		user_id: user.id,
	});

	const response = await client.get(`/challenges/${challenge.id}`).end();

	response.assertStatus(200);
	response.assertJSONSubset(challenge.toJSON());
});

test('POST /challenges creates a new challenge', async ({ client, assert }) => {
	const { user } = await createUser({ append: { status: 'verified' } });
	const keywordTaxonomy = await Taxonomy.getTaxonomy('KEYWORDS');
	const keywordTerms = await Factory.model('App/Models/Term').createMany(5);
	await keywordTaxonomy.terms().saveMany(keywordTerms);
	const keywordTermsIds = keywordTerms.map((keyword) => keyword.id);

	const challenge = await Factory.model('App/Models/Challenge').make();

	const response = await client
		.post('/challenges')
		.loginVia(user, 'jwt')
		.send({
			...challenge.toJSON(),
			keywords: keywordTermsIds,
		})
		.end();

	const challengeCreated = await Challenge.findOrFail(response.body.id);
	await challengeCreated.load('terms');

	response.assertStatus(200);
	response.assertJSONSubset({ ...challengeCreated.toJSON(), ...keywordTerms.rows });
	assert.equal(user.id, challengeCreated.user_id);
	assert.isTrue(AlgoliaSearch.initIndex.called);
	assert.isTrue(AlgoliaSearch.initIndex().saveObject.calledOnce);
});

test('PUT /challenges/:id returns an error if the user is not authorized', async ({ client }) => {
	const { user } = await createUser({ append: { status: 'verified' } });

	const keywordTaxonomy = await Taxonomy.getTaxonomy('KEYWORDS');

	const oldKeywordTerms = await Factory.model('App/Models/Term').createMany(5);
	await keywordTaxonomy.terms().saveMany(oldKeywordTerms);
	const oldKeywordTermsIds = oldKeywordTerms.map((keyword) => keyword.id);

	const challenge = await Factory.model('App/Models/Challenge').create();
	await challenge.terms().attach(oldKeywordTermsIds);

	const newKeywordTerms = await Factory.model('App/Models/Term').createMany(5);
	await keywordTaxonomy.terms().saveMany(newKeywordTerms);
	const newKeywordTermsIds = newKeywordTerms.map((keyword) => keyword.id);

	const challengeData = await Factory.model('App/Models/Challenge').make();

	const response = await client
		.put(`/challenges/${challenge.id}`)
		.loginVia(user, 'jwt')
		.send({
			...challengeData.toJSON(),
			keywords: newKeywordTermsIds,
		})
		.end();

	response.assertStatus(403);
	response.assertJSONSubset(
		errorPayload(errors.UNAUTHORIZED_ACCESS, antl('error.permission.unauthorizedAccess')),
	);
});

test('PUT /challenges/:id updates an challenge', async ({ client, assert }) => {
	const { user } = await createUser({ append: { status: 'verified' } });

	const keywordTaxonomy = await Taxonomy.getTaxonomy('KEYWORDS');

	const oldKeywordTerms = await Factory.model('App/Models/Term').createMany(5);
	await keywordTaxonomy.terms().saveMany(oldKeywordTerms);
	const oldKeywordTermsIds = oldKeywordTerms.map((keyword) => keyword.id);

	const challenge = await Factory.model('App/Models/Challenge').create({
		user_id: user.id,
	});
	await challenge.terms().attach(oldKeywordTermsIds);

	const newKeywordTerms = await Factory.model('App/Models/Term').createMany(5);
	await keywordTaxonomy.terms().saveMany(newKeywordTerms);
	const newKeywordTermsIds = newKeywordTerms.map((keyword) => keyword.id);

	const challengeData = await Factory.model('App/Models/Challenge').make();

	const payload = {
		...challengeData.toJSON(),
		keywords: newKeywordTermsIds,
	};

	const response = await client
		.put(`/challenges/${challenge.id}`)
		.loginVia(user, 'jwt')
		.send(payload)
		.end();

	const challengeUpdated = await Challenge.findOrFail(response.body.id);
	await challengeUpdated.load('terms');

	response.assertStatus(200);
	response.assertJSONSubset({ ...challengeUpdated.toJSON(), ...newKeywordTerms.rows });
	assert.equal(payload.title, challengeUpdated.title);
	assert.equal(payload.description, challengeUpdated.description);
	assert.isTrue(AlgoliaSearch.initIndex.called);
	assert.isTrue(AlgoliaSearch.initIndex().saveObject.calledOnce);
});

test('DELETE /challenges/:id returns an error if the user is not authorized', async ({
	client,
}) => {
	const { user } = await createUser({ append: { status: 'verified' } });
	const challenge = await Factory.model('App/Models/Challenge').create();

	const response = await client
		.delete(`/challenges/${challenge.id}`)
		.loginVia(user, 'jwt')
		.end();

	response.assertStatus(403);
	response.assertJSONSubset(
		errorPayload(errors.UNAUTHORIZED_ACCESS, antl('error.permission.unauthorizedAccess')),
	);
});

test('DELETE /challenges/:id deletes an challenge', async ({ client, assert }) => {
	const { user } = await createUser({ append: { status: 'verified' } });
	const challenge = await Factory.model('App/Models/Challenge').create({
		user_id: user.id,
	});

	const response = await client
		.delete(`/challenges/${challenge.id}`)
		.loginVia(user, 'jwt')
		.end();

	const challengeFromDatabase = await Challenge.query()
		.where({ id: challenge.id })
		.first();

	response.assertStatus(200);
	assert.isNull(challengeFromDatabase);
	assert.isTrue(AlgoliaSearch.initIndex.called);
	assert.isTrue(
		AlgoliaSearch.initIndex().deleteObject.withArgs(challenge.toJSON().objectID).calledOnce,
	);
});
