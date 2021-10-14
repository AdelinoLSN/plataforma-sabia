import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import Head from '../components/head';
import { Intro, ListItems, IdeaCard } from '../components/LandingPage';
import { algoliaDefaultConfig } from '../components/Algolia/provider';
import { urlToSearchState, findResultsState, searchStateToURL } from '../utils/algoliaHelper';

const searchComponents = {
	sortBy: {
		defaultRefinement: algoliaDefaultConfig.challenge.indexName,
		items: [
			{
				label: 'Lançamento',
				value: `${algoliaDefaultConfig.challenge.indexName}_created_at_asc`,
			},
			{
				label: 'Atualização',
				value: `${algoliaDefaultConfig.challenge.indexName}_created_at_desc`,
			},
		],
	},
	hits: {
		component: IdeaCard,
		loadMore: 'Ver mais desafios tecnológicos',
	},
};

const ChallengeList = ({ initialSearchState, resultsState }) => {
	const { t } = useTranslation(['pages']);
	const [searchState, setSearchState] = useState(initialSearchState);

	const onSearchStateChange = (newSearchState) => {
		searchStateToURL(newSearchState);
		setSearchState(newSearchState);
	};

	return (
		<>
			<Head
				title={t('pages:challenges.title')}
				description={t('pages:challenges.description')}
				keywords={t('pages:challenges.keywords')}
			/>
			<Intro
				title="Não encontrou o que desejava?"
				subtitle="Aqui você pode dividir com a gente seus desafios tecnológicos."
				image={{
					src: '/brainstorming-rafiki.svg',
					alt:
						'Pessoas fazendo um brainstorming com uma ilustração de uma grande lâmpada acima delas',
				}}
				link={{
					label: 'Apontar seu desafio',
					href: 'register-challenge',
					scroll: true,
				}}
			/>
			<ListItems
				title="Desafios tecnológicos"
				searchPlaceholder="Qual desafio tecnológico você busca?"
				createURL={searchStateToURL}
				indexName={algoliaDefaultConfig.challenge.indexName}
				searchState={searchState}
				resultsState={resultsState}
				onSearchStateChange={onSearchStateChange}
				searchComponents={searchComponents}
			/>
		</>
	);
};

ChallengeList.propTypes = {
	initialSearchState: PropTypes.shape({}).isRequired,
	resultsState: PropTypes.shape({}).isRequired,
};

ChallengeList.getInitialProps = async ({ asPath }) => {
	const initialSearchState = urlToSearchState(asPath);
	const resultsState = await findResultsState(ListItems, initialSearchState, 'challenge', {
		searchComponents,
	});
	return { initialSearchState, resultsState };
};

export default ChallengeList;
