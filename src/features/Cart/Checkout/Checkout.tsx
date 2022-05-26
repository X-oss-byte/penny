import { useMutation } from '@apollo/client';
import { useAtomValue, useSetAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import type { CreateMyCartResponse } from 'queries';
import { CreateMyCartMutation } from 'queries';
import { useCallback, useEffect } from 'react';
import type { MutationShopifyStorefront_CartCreateArgs } from 'types/takeshape';
import { cartItemsAtom, cartQuantityAtom, isCartCheckingOutAtom } from '../store';
import { getCheckoutPayload } from '../utils';

export const CartCheckout = () => {
  const { data: session } = useSession();

  const setIsCartCheckingOut = useSetAtom(isCartCheckingOutAtom);
  const quantity = useAtomValue(cartQuantityAtom);
  const items = useAtomValue(cartItemsAtom);

  const [setCheckoutPayload, { data: checkoutData }] = useMutation<
    CreateMyCartResponse,
    MutationShopifyStorefront_CartCreateArgs
  >(CreateMyCartMutation);

  const handleCheckout = useCallback(() => {
    setIsCartCheckingOut(true);
    setCheckoutPayload({
      variables: getCheckoutPayload(items, session)
    });
  }, [items, setCheckoutPayload, setIsCartCheckingOut, session]);

  useEffect(() => {
    if (checkoutData?.myCart?.cart?.checkoutUrl) {
      window.location.href = checkoutData.myCart.cart.checkoutUrl;
    }
  }, [checkoutData]);

  return (
    <button
      onClick={handleCheckout}
      disabled={quantity === 0}
      className="flex items-center justify-center w-full cursor-pointer rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      Checkout
    </button>
  );
};

export default CartCheckout;
