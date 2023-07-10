import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';

export default configureStore({
  reducer: {
    task: taskReducer,
    auth: authReducer,
    category: categoryReducer
  }
});
