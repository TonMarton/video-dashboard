import { configureStore } from '@reduxjs/toolkit';
import { videoApi } from './api/videoApi';

export const store = configureStore({
  reducer: {
    [videoApi.reducerPath]: videoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(videoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
