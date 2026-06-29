import { useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PATHS } from "@/constants/routes";
import { useAddToCartMutation } from "@/store/cart/cart.api";
import { useAppSelector } from "@/store/hooks";
import { getApiErrorMessage } from "@/utils/api-error";

/**
 * Shared add-to-cart action. Auth-gates guests to sign-in, otherwise calls the
 * server cart and toasts the result. Returns whether the item was added.
 */
export function useAddToCart() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const add = useCallback(
    async (productId: string, quantity = 1): Promise<boolean> => {
      if (!user) {
        toast("Please sign in to add items to your cart", { icon: "ℹ️" });
        router.push(PATHS.auth.signIn);
        return false;
      }
      try {
        await addToCart({ productId, quantity }).unwrap();
        toast.success("Added to cart");
        return true;
      } catch (error) {
        toast.error(getApiErrorMessage(error));
        return false;
      }
    },
    [user, router, addToCart],
  );

  return { add, isLoading };
}
