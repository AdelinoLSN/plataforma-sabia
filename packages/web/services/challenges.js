/* eslint-disable import/prefer-default-export */
import { apiPost } from './api';

/**
 * Creates an challenge.
 *
 * @param {string} title The title of the challenge
 * @param {string} description The description of the challenge
 * @param {Array} keywords The keywords of the challenge
 * @returns {object} The newly created challenge
 */
export const createChallenge = async (title, description, keywords = []) => {
	const { data, status } = await apiPost(`challenges`, { title, description, keywords });

	return status !== 200 ? { data: data?.error, success: false } : { data, success: true };
};
