import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from './api';
import type { Product, Price, Variant, Provider, InsertProduct, InsertPrice } from '@shared/schema';

interface ProductsState {
  selectedProduct: Product | null;
  selectedVariant: Variant | null;
  priceHistory: Price[];
  currentPrices: Array<Price & { provider: Provider }>;
}

const initialState: ProductsState = {
  selectedProduct: null,
  selectedVariant: null,
  priceHistory: [],
  currentPrices: [],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setSelectedVariant: (state, action: PayloadAction<Variant | null>) => {
      state.selectedVariant = action.payload;
    },
  },
});

// RTK Query endpoints for products
export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], { categoryId?: number; subcategoryId?: number }>({
      query: ({ categoryId, subcategoryId }) => ({
        url: '/products',
        params: { categoryId, subcategoryId },
      }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<Product, InsertProduct>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<Product, { id: number; product: Partial<InsertProduct> }>({
      query: ({ id, product }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    getProductPrices: builder.query<Price[], { productId: number; variantId?: number }>({
      query: ({ productId, variantId }) => ({
        url: `/products/${productId}/prices`,
        params: { variantId },
      }),
      providesTags: ['Price'],
    }),
    getPriceHistory: builder.query<Price[], { productId: number; days?: number }>({
      query: ({ productId, days = 30 }) => ({
        url: `/products/${productId}/price-history`,
        params: { days },
      }),
      providesTags: ['Price'],
    }),
    createPrice: builder.mutation<Price, InsertPrice>({
      query: (price) => ({
        url: '/prices',
        method: 'POST',
        body: price,
      }),
      invalidatesTags: ['Price'],
    }),
    getProductVariants: builder.query<Variant[], number>({
      query: (productId) => `/products/${productId}/variants`,
      providesTags: ['Product'],
    }),
    getProviders: builder.query<Provider[], void>({
      query: () => '/providers',
      providesTags: ['Provider'],
    }),
    triggerScrape: builder.mutation<{ message: string; productId: number; status: string }, number>({
      query: (productId) => ({
        url: `/scrape/${productId}`,
        method: 'POST',
      }),
    }),
  }),
});

export const { setSelectedProduct, setSelectedVariant } = productsSlice.actions;
export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductPricesQuery,
  useGetPriceHistoryQuery,
  useCreatePriceMutation,
  useGetProductVariantsQuery,
  useGetProvidersQuery,
  useTriggerScrapeMutation,
} = productsApi;

export default productsSlice.reducer;
