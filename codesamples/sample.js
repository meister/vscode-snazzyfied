import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Layout from './layout';
import Header from 'containers/layout/header';
import Columns from 'components/layout/columns';
import Column from 'components/layout/column';
import Block from 'containers/blocks';
import {
	getCurrentDashboard,
	getCurrentDashboardBlockIdsOrderedInColumns
} from 'selectors/dashboard/dashboards';
import {changeDashboard} from 'actions/dashboard/dashboards';

export class Dashboard extends Component {
	changeDashboard() {
		this.props.changeDashboard(this.props.dashboardId === 1 ? 2 : 1);
	}

	render() {
		const {title, columns} = this.props;

		return (
			<Layout>
				<Header title={title} onClick={this.changeDashboard.bind(this)} />
				<Columns>
					{columns.map((blocks, index) => (
						<Column key={index}>
							{blocks.map((id) => (
								<Block key={id} blockId={id} />
							))}
						</Column>
					))}
				</Columns>
			</Layout>
		);
	}
}

Dashboard.propTypes = {
	title: PropTypes.string.isRequired,
	columns: PropTypes.array.isRequired,
	dashboardId: PropTypes.number,
	changeDashboard: PropTypes.func
};

const mapStateToProps = (state) => ({
	title: getCurrentDashboard(state).title,
	dashboardId: getCurrentDashboard(state).id,
	columns: getCurrentDashboardBlockIdsOrderedInColumns(state)
});

const mapDispatchToProps = {
	changeDashboard
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);