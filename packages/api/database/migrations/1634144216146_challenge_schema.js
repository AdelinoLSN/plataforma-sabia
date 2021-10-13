/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ChallengeSchema extends Schema {
	up() {
		this.create('challenges', (table) => {
			table.increments();
			table.string('title').notNullable();
			table.text('description').notNullable();
			table
				.integer('user_id')
				.unsigned()
				.references('id')
				.inTable('users')
				.onUpdate('CASCADE')
				.onDelete('SET NULL');
			table.timestamps();
		});
	}

	down() {
		this.drop('challenges');
	}
}

module.exports = ChallengeSchema;
