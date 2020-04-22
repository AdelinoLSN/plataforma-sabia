import React, { useState } from 'react';
import Router from 'next/router';
import { StyledHits, StyledStats } from './styles';
import SearchBox from '../SearchBox';
import SearchItem from './SearchItem';

const Search = () => {
	const [termQuery, setTermQuery] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		return Router.push({
			pathname: '/search',
			query: { q: termQuery },
		});
	};
	return (
		<>
			<SearchBox
				placeholder="Qual solução você busca?"
				onChange={(e) => setTermQuery(e.currentTarget.value)}
				onSubmit={handleSubmit}
			/>
			<StyledStats
				translations={{
					stats(nbHits, timeSpentMS) {
						let msg;
						if (termQuery.length > 2 && nbHits) {
							msg = `${nbHits} resultado(s) encontrado(s) para o termo "${termQuery}" em ${timeSpentMS}ms`;
						} else if (!nbHits && timeSpentMS) {
							msg = `Não foram encontrados resultados para o termo "${termQuery}"`;
						}
						return msg;
					},
				}}
			/>
			<StyledHits hitComponent={SearchItem} />
		</>
	);
};

export default Search;
