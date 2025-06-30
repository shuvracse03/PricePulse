import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// RTK Query API
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  tagTypes: ['User', 'Category', 'Subcategory', 'Product', 'Price', 'Provider', 'Watchlist'],
  endpoints: () => ({}),
});