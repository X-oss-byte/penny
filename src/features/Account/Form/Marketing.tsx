import { useMutation, useQuery } from '@apollo/client';
import FormToggleWithRightLabel from 'components/Form/Toggle/ToggleWithRightLabel';
import type {
  GetCustomerResponse,
  GetMyNewsletterSubscriptionsResponse,
  SubscribeMyEmailToNewsletterResponse,
  UnsubscribeMyEmailFromNewsletterResponse,
  UpdateCustomerResponse
} from 'queries';
import {
  GetCustomerQuery,
  GetMyNewsletterSubscriptionsQuery,
  SubscribeMyEmailToNewsletterMutation,
  UnsubscribeMyEmailFromNewsletterMutation,
  UpdateCustomerMutation
} from 'queries';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type {
  MutationSubscribeMyEmailToNewsletterArgs,
  MutationUnsubscribeMyEmailFromNewsletterArgs,
  MutationUpdateMyCustomerArgs
} from 'types/takeshape';
import { formatError } from 'utils/errors';
import FormTwoColumnCard from '../../../components/Form/TwoColumnCard/TwoColumnCard';

interface AccountFormMarketingForm {
  newsletters: Record<string, boolean>;
  acceptsMarketing: boolean;
}

export const AccountFormMarketing = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isSubmitSuccessful, errors, dirtyFields }
  } = useForm<AccountFormMarketingForm>();

  const { data: newsletterData } = useQuery<GetMyNewsletterSubscriptionsResponse>(GetMyNewsletterSubscriptionsQuery);
  const { data: customerData } = useQuery<GetCustomerResponse>(GetCustomerQuery);
  const [updateCustomer, { data: customerResponse }] = useMutation<
    UpdateCustomerResponse,
    MutationUpdateMyCustomerArgs
  >(UpdateCustomerMutation);

  const [subscribe] = useMutation<SubscribeMyEmailToNewsletterResponse, MutationSubscribeMyEmailToNewsletterArgs>(
    SubscribeMyEmailToNewsletterMutation
  );
  const [unsubscribe] = useMutation<
    UnsubscribeMyEmailFromNewsletterResponse,
    MutationUnsubscribeMyEmailFromNewsletterArgs
  >(UnsubscribeMyEmailFromNewsletterMutation);

  const onSubmit = useCallback(
    async ({ acceptsMarketing, newsletters }: AccountFormMarketingForm) => {
      if (dirtyFields.acceptsMarketing) {
        await updateCustomer({ variables: { customer: { acceptsMarketing } } });
      }

      if (dirtyFields.newsletters) {
        await Promise.all(
          Object.keys(dirtyFields.newsletters).map((listId) => {
            if (newsletters[listId]) {
              return subscribe({ variables: { list_id: listId } });
            } else {
              return unsubscribe({ variables: { list_id: listId } });
            }
          })
        );
      }

      reset(undefined, {
        keepValues: true
      });
    },
    [dirtyFields.acceptsMarketing, dirtyFields.newsletters, reset, updateCustomer, subscribe, unsubscribe]
  );

  // Set initial values
  useEffect(() => {
    if (newsletterData?.newsletters && customerData?.customer) {
      reset({
        acceptsMarketing: customerData.customer.acceptsMarketing,
        newsletters: newsletterData.newsletters.reduce<AccountFormMarketingForm['newsletters']>(
          (p, c) => ({
            ...p,
            [c.listId]: c.subscribed
          }),
          {}
        )
      });
    }
  }, [newsletterData, customerData, reset]);

  // Reset form notices
  useEffect(() => {
    if (isSubmitSuccessful) {
      const timer = setTimeout(() => reset(undefined, { keepValues: true }), 5000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isSubmitSuccessful, reset]);

  const isReady = Boolean(newsletterData && customerData);
  const error =
    customerResponse?.customerUpdate?.customerUserErrors &&
    formatError(customerResponse.customerUpdate.customerUserErrors);

  return (
    <FormTwoColumnCard
      primaryText="Marketing &amp; Newsletters"
      secondaryText="What should you send you?"
      onSubmit={handleSubmit(onSubmit)}
      isReady={isReady}
      isSubmitting={isSubmitting}
      isSubmitSuccessful={isSubmitSuccessful}
      isValid={Object.entries(errors).length === 0}
      error={error}
    >
      <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
        <fieldset>
          <legend className="sr-only">Newsletters</legend>
          <div className="text-base font-medium text-gray-900" aria-hidden="true">
            Newsletters
          </div>
          <div className="mt-4 space-y-4">
            {newsletterData?.newsletters?.map((newsletter) => {
              return (
                <div key={newsletter.listId}>
                  <FormToggleWithRightLabel
                    control={control}
                    name={`newsletters.${newsletter.listId}`}
                    labelPrimary={newsletter.listName}
                    className="flex items-center h-5"
                  />
                </div>
              );
            })}
          </div>
        </fieldset>
        <fieldset>
          <legend className="sr-only">Marketing</legend>
          <div className="text-base font-medium text-gray-900" aria-hidden="true">
            Marketing
          </div>
          <div className="mt-4 space-y-4">
            <FormToggleWithRightLabel
              control={control}
              disabled={!isReady}
              name="acceptsMarketing"
              labelPrimary="Allow marketing communications"
              className="flex items-center h-5"
            />
          </div>
        </fieldset>
      </div>
    </FormTwoColumnCard>
  );
};

export default AccountFormMarketing;
