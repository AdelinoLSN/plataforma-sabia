/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ChallengeTermSchema extends Schema {
	up() {
		this.create('challenge_term', (table) => {
			table
				.integer('challenge_id')
				.unsigned()
				.index('challenge_id');
			table
				.integer('term_id')
				.unsigned()
				.index('term_id');
			table
				.foreign('challenge_id')
				.references('challenges.id')
				.onDelete('cascade');
			table
				.foreign('term_id')
				.references('terms.id')
				.onDelete('cascade');
		});
	}

	down() {
		this.drop('challenge_term');
	}
}

module.exports = ChallengeTermSchema;
