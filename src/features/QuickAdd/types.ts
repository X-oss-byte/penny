import { SetRequired } from 'type-fest';
import { ProductBase } from 'types/product';
import {
  ReviewsIo_ListProductReviewsResponse,
  Shopify_Product,
  Shopify_ProductVariantConnection
} from 'types/takeshape';

export type QuickAddShopifyProduct = Pick<
  Shopify_Product,
  | 'id'
  | 'title'
  | 'description'
  | 'descriptionHtml'
  | 'requiresSellingPlan'
  | 'priceRangeV2'
  | 'featuredImage'
  | 'publishedAt'
  | 'totalInventory'
  | 'totalVariants'
  | 'options'
  | 'sellingPlanGroupCount'
  | 'sellingPlanGroups'
  | 'takeshape'
> & {
  variants: Shopify_ProductVariantConnection;
};

export type QuickAddProduct = SetRequired<ProductBase, 'variants'>;
export type QuickAddReviewsIoReviews = Pick<ReviewsIo_ListProductReviewsResponse, 'stats'>;

export type QuickAdd = {
  productId: string;
};
