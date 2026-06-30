import { useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PATHS } from "@/constants/routes";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/wishlist/wishlist.api";
import { useAppSelector } from "@/store/hooks";
import { getApiErrorMessage } from "@/utils/api-error";

/**
 * Shared wishlist action. Guests are auth-gated to sign-in; otherwise it toggles
 * the product in the server wishlist (RTK invalidation keeps every consumer in
 * sync) and toasts the result. `isWishlisted(id)` reads the live wishlist cache.
 */
export function useWishlistToggle() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data: wishlist } = useGetWishlistQuery(undefined, { skip: !user });
  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] =
    useRemoveFromWishlistMutation();

  const isWishlisted = useCallback(
    (productId: string) =>
      Boolean(wishlist?.some((item) => item._id === productId)),
    [wishlist],
  );

  const toggle = useCallback(
    async (productId: string): Promise<void> => {
      if (!user) {
        toast("Please sign in to use your wishlist", { icon: "ℹ️" });
        router.push(PATHS.auth.signIn);
        return;
      }
      const wasWishlisted = isWishlisted(productId);
      try {
        if (wasWishlisted) {
          await removeFromWishlist(productId).unwrap();
          toast.success("Removed from wishlist");
        } else {
          await addToWishlist(productId).unwrap();
          toast.success("Added to wishlist");
        }
      } catch (error) {
        toast.error(getApiErrorMessage(error));
      }
    },
    [user, router, isWishlisted, addToWishlist, removeFromWishlist],
  );

  return { toggle, isWishlisted, isBusy: isAdding || isRemoving };
}
