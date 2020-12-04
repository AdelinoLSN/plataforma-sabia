import React from 'react';
import PropTypes from 'prop-types';
import {
	SimpleShowLayout,
	TextField,
	BooleanField,
	NumberField,
	ArrayField,
	Datagrid,
} from 'react-admin';

const CostForm = ({ record, resource }) => {
	let { costs } = record;
	costs = costs
		? {
				...costs[0],
				funding_required: !!costs.funding_required,
				is_seller: !!costs.is_seller,
		  }
		: { funding_required: false, is_seller: false };
	return (
		<SimpleShowLayout record={costs} resource={resource}>
			<BooleanField source="funding_required" fullWidth />
			<TextField source="notes" fullWidth />
			<NumberField source="funding_value" />
			<TextField source="funding_status" />
			<TextField source="funding_type" />
			<BooleanField source="is_seller" />
			<TextField source="price" />
			<ArrayField source="costs">
				<Datagrid>
					<TextField source="cost_type" />
					<TextField source="description" />
					<TextField source="type" />
					<TextField source="measure_unit" />
					<TextField source="quantity" />
					<TextField source="value" />
				</Datagrid>
			</ArrayField>
		</SimpleShowLayout>
	);
};
CostForm.propTypes = {
	record: PropTypes.shape({
		costs: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.number,
			}),
		),
	}),
	resource: PropTypes.string,
};

CostForm.defaultProps = {
	record: { id: null },
	resource: '',
};

export default CostForm;
