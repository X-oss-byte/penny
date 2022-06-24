import { useQuery } from '@apollo/client';
import { AccountLoyaltyCard } from 'features/AccountLoyaltyCard/AccountLoyaltyCard';
import { GetMyLoyaltyCardQuery, GetMyLoyaltyCardResponse } from 'features/AccountLoyaltyCard/queries';
import { AccountReferrals } from 'features/AccountReferrals/AccountReferrals';
import Layout from 'layouts/Account';
import { getLayoutData } from 'layouts/getLayoutData';
import { InferGetStaticPropsType, NextPage } from 'next';

const AccountRewardsPage: NextPage = ({ navigation, footer }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data } = useQuery<GetMyLoyaltyCardResponse>(GetMyLoyaltyCardQuery);

  if (!data) {
    return null;
  }

  return (
    <Layout navigation={navigation} footer={footer} seo={{ title: 'Rewards' }}>
      <AccountReferrals />
      <AccountLoyaltyCard
        code={data?.loyaltyCard.code}
        loyalty_card={data?.loyaltyCard.loyalty_card}
        assets={data?.loyaltyCard.assets}
      />
    </Layout>
  );
};

export const getStaticProps = async () => {
  const { navigation, footer } = await getLayoutData();
  return { props: { navigation, footer } };
};

export default AccountRewardsPage;
