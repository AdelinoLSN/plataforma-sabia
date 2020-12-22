import React from 'react';
import PropTypes from 'prop-types';
import {
	List,
	Datagrid,
	TextField,
	SingleFieldList,
	EditButton,
	DeleteWithConfirmButton,
	ReferenceField,
} from 'react-admin';
import { ChipField, ReferenceArrayField } from '../../components';

const IdeasList = ({ basePath, resource, hasCreate, hasEdit, hasList, hasShow }) => (
	<List
		basePath={basePath}
		resource={resource}
		hasCreate={hasCreate}
		hasEdit={hasEdit}
		hasList={hasList}
		hasShow={hasShow}
		perPage={25}
	>
		<Datagrid>
			<TextField source="id" />
			<TextField source="title" />
			<TextField source="description" />
			<ReferenceField label="Owner" source="user_id" reference="users">
				<TextField source="email" />
			</ReferenceField>
			<ReferenceArrayField label="Terms" reference="terms" source="terms">
				<SingleFieldList>
					<ChipField source="term" />
				</SingleFieldList>
			</ReferenceArrayField>
			<EditButton />
			<DeleteWithConfirmButton />
		</Datagrid>
	</List>
);
IdeasList.propTypes = {
	resource: PropTypes.string.isRequired,
	basePath: PropTypes.string.isRequired,
	hasCreate: PropTypes.bool.isRequired,
	hasEdit: PropTypes.bool.isRequired,
	hasList: PropTypes.bool.isRequired,
	hasShow: PropTypes.bool.isRequired,
};

export default IdeasList;