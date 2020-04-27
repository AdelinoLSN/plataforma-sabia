const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

const customConfig = { threshold: 0.01 };
const toMatchImageSnapshot = configureToMatchImageSnapshot({
	customDiffConfig: customConfig,
	failureThreshold: 0.03,
});

expect.extend({ toMatchImageSnapshot });
