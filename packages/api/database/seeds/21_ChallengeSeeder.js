/*
|--------------------------------------------------------------------------
| ChallengeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const User = use('App/Models/User');
const Taxonomy = use('App/Models/Taxonomy');

class ChallengeSeeder {
	async run() {
		const getRandom = (list) => {
			return list.rows[Math.floor(Math.random() * list.rows.length)];
		};

		const challenges = await Factory.model('App/Models/Challenge').createMany(30);
		const users = await await User.query()
			.limit(5)
			.fetch();
		const statuses = {
			rows: ['pending', 'approved', 'rejected'],
		};
		const keywords = await Taxonomy.getTaxonomyTerms('KEYWORDS');

		await Promise.all(
			challenges.map(async (challenge) => {
				const user = getRandom(users);
				const keyword = getRandom(keywords);
				const keyword2 = getRandom(keywords);
				const keyword3 = getRandom(keywords);
				await challenge.user().associate(user);
				await challenge.terms().attach([keyword.id, keyword2.id, keyword3.id]);
				challenge.status = getRandom(statuses);
				await challenge.save();
			}),
		);
	}
}

module.exports = ChallengeSeeder;
