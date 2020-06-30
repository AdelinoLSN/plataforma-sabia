import React from 'react';
import PropTypes from 'prop-types';
import cookies from 'next-cookies';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FiPlus } from 'react-icons/fi';
import { Protected } from '../../../components/Authorization';
import { UserProfile } from '../../../components/UserProfile';
import { DataGrid } from '../../../components/DataGrid';
import { getUserTechnologies } from '../../../services';
import { Title } from '../../../components/Common';
import { Link } from '../../../components/Link';
import { getPeriod } from '../../../utils/helper';
import { SabiaApp } from '../../_app';

const MyAccount = ({ technologies }) => {
	const { t } = useTranslation(['helper', 'account']);
	return (
		<Container>
			<Protected>
				<UserProfile />
				<MainContent>
					<Title align="left" noPadding noMargin>
						{t('account:myTechnologies')}
					</Title>
					{technologies.length > 0 ? (
						<MainContentContainer>
							<InfoContainer>
								<AddButton href="/technology/new" as="a">
									<span>{t('account:addTechnologies')}</span>
									<FiPlus />
								</AddButton>
								<Stats>
									{t('account:registeredTechnologies', {
										count: technologies.length,
									})}
								</Stats>
							</InfoContainer>
							<DataGrid
								data={technologies.map(
									({ id, title, status, installation_time }) => ({
										id,
										Título: title,
										Status: status,
										'Tempo de implantação': getPeriod(t, installation_time),
									}),
								)}
							/>
						</MainContentContainer>
					) : (
						<NoTechnologies>{t('account:noTechnologyToShow')}</NoTechnologies>
					)}
				</MainContent>
			</Protected>
		</Container>
	);
};

MyAccount.propTypes = {
	technologies: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

MyAccount.getInitialProps = async (ctx) => {
	const user = SabiaApp.getUser();
	const { token } = cookies(ctx);

	const technologies = token ? await getUserTechnologies(user.id, token) : [];

	return {
		technologies,
		namespacesRequired: ['helper', 'account', 'profile', 'datagrid'],
	};
};

export const Container = styled.div`
	display: flex;
	margin: 0 auto;
	background-color: ${({ theme }) => theme.colors.whiteSmoke};
	padding: 3rem 4rem 6rem;

	> section:first-child {
		margin-right: 4rem;
	}

	@media screen and (max-width: 950px) {
		flex-direction: column;

		button {
			margin-bottom: 1rem;
		}
	}
`;

export const MainContent = styled.section`
	width: 100%;
`;

export const MainContentContainer = styled.div`
	min-height: 80vh;
	background-color: ${({ theme }) => theme.colors.white};
	padding: 2rem;
`;

export const InfoContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1rem;

	@media screen and (max-width: 950px) {
		flex-direction: column;

		button {
			margin-bottom: 1rem;
		}
	}
`;

export const AddButton = styled(Link)`
	background-color: ${({ theme }) => theme.colors.secondary};
	color: ${({ theme }) => theme.colors.white};
	padding: 0.5rem 3rem;
	display: flex;
	align-items: center;
	border-radius: 3rem;
	border: none;
	text-align: center;

	span {
		margin-right: 1rem;
	}

	:hover {
		opacity: 0.8;
	}
`;

export const Stats = styled.span`
	color: ${({ theme }) => theme.colors.secondary};
	font-size: 1.4rem;
`;

export const NoTechnologies = styled.span`
	color: ${({ theme }) => theme.colors.darkGray};
	font-size: 2rem;
`;

export default MyAccount;
