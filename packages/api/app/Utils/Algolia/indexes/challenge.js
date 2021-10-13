const { initIndex } = require('../core');
const { normalizeKeywords } = require('../normalizes');

/**
 * Prepare challenge object for Algolia
 *
 * @param {object} challenge The challenge object
 * @returns {object} The challenge data for Algolia
 */
const prepareChallenge = (challenge) => {
	const challengeData = typeof challenge?.toJSON === 'function' ? challenge.toJSON() : challenge;

	const challengeForAlgolia = {
		...challengeData,
	};

	if (challengeData?.keywords?.length) {
		challengeForAlgolia.keywords = normalizeKeywords(challengeData.keywords);
	}

	if (challengeData?.user) {
		challengeForAlgolia.user = {
			id: challengeData.user.id,
			full_name: challengeData.user.full_name,
		};
		delete challengeForAlgolia.user_id;
	}

	return challengeForAlgolia;
};

/**
 * Index challenge to Algolia.
 *
 * @param {object|object[]} data Challenge data
 * @param {object} options Options passed
 * @param {boolean} options.saveMany Save too many objects or just one
 */
module.exports = async (data, options = {}) => {
	const { saveObjects, saveObject } = initIndex('challenge');

	if (options.saveMany) {
		const challenges = await data.map((challenge) => prepareChallenge(challenge));
		return saveObjects(challenges);
	}

	const challenge = await prepareChallenge(data);
	return saveObject(challenge);
};
