export const technologies = [
	{
		id: 1,
		title: 'Barragem Subterrânea',
		category: 'Saneamento Básico',
		thumbnail: '/card-image.jpg',
		date: new Date('2019-06-22'),
		likes: 6,
		installation_time: 25,
		url: '/',
	},
	{
		id: 2,
		title: 'Bomba a Energia Solar',
		category: 'Saneamento Básico',
		thumbnail: '/card-image2.jpg',
		date: new Date('2019-06-22'),
		likes: 18,
		installation_time: 70,
		url: '/',
	},
	{
		id: 3,
		title: 'Cisterna Pré-moldada',
		category: 'Saneamento Básico',
		thumbnail: '/card-image3.jpg',
		date: new Date('2019-09-22'),
		likes: 6,
		installation_time: 200,
		url: '/',
	},
	{
		id: 4,
		title: 'Cisterna Pré-moldada',
		category: 'Saneamento Básico',
		thumbnail: '/card-image3.jpg',
		date: new Date('2017-09-22'),
		likes: 6,
		installation_time: 200,
		url: '/',
	},
];

export const fullTechnologies = [
	...technologies,
	...technologies.map((technology) => ({ ...technology, id: technology.id * 10 })),
];
