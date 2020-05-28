import React from 'react';
import { Admin, Resource } from 'react-admin';
import authProvider from './providers/authProvider';
import dataProvider from './providers/dataProvider';

import { LoginPage } from './components/Auth';
import routes from './routes';

import { TechnologiesList, TechnologiesCreate, TechnologiesEdit } from './pages/technologies';

const App = () => {
	return (
		<Admin
			loginPage={LoginPage}
			authProvider={authProvider}
			dataProvider={dataProvider}
			customRoutes={routes}
		>
			<Resource
				name="technologies"
				list={TechnologiesList}
				create={TechnologiesCreate}
				edit={TechnologiesEdit}
			/>
		</Admin>
	);
};
export default App;