import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from './api';
import type { Category, Subcategory, InsertCategory, InsertSubcategory } from '@shared/schema';

interface CategoriesState {
  selectedCategory: Category | null;
  selectedSubcategory: Subcategory | null;
}

const initialState: CategoriesState = {
  selectedCategory: null,
  selectedSubcategory: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
      state.selectedSubcategory = null; // Reset subcategory when category changes
    },
    setSelectedSubcategory: (state, action: PayloadAction<Subcategory | null>) => {
      state.selectedSubcategory = action.payload;
    },
  },
});

// RTK Query endpoints for categories
export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    getCategory: builder.query<Category, number>({
      query: (id) => `/categories/${id}`,
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<Category, InsertCategory>({
      query: (category) => ({
        url: '/categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['Category'],
    }),
    getSubcategories: builder.query<Subcategory[], number | undefined>({
      query: (categoryId) => ({
        url: '/subcategories',
        params: categoryId ? { categoryId } : {},
      }),
      providesTags: ['Subcategory'],
    }),
    createSubcategory: builder.mutation<Subcategory, InsertSubcategory>({
      query: (subcategory) => ({
        url: '/subcategories',
        method: 'POST',
        body: subcategory,
      }),
      invalidatesTags: ['Subcategory'],
    }),
  }),
});

export const { setSelectedCategory, setSelectedSubcategory } = categoriesSlice.actions;
export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useGetSubcategoriesQuery,
  useCreateSubcategoryMutation,
} = categoriesApi;

export default categoriesSlice.reducer;
