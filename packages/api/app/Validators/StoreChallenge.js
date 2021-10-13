const BaseValidator = use('App/Validators/BaseValidator');

class StoreChallenge extends BaseValidator {
	get rules() {
		return {
			title: 'string|required',
			description: 'string|required',
			keywords: 'array|required',
		};
	}
}

module.exports = StoreChallenge;
