import { createSlice } from '@reduxjs/toolkit';

export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    currentCategory: '',
    categoryNotFromList: 0,
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    setCategoryNotFromList: (state, action) => {
      state.categoryNotFromList = action.payload;
    },
  }
});

export const {
  setCategories,
  setCurrentCategory,
  setCategoryNotFromList,
} = categorySlice.actions;

export default categorySlice.reducer;
