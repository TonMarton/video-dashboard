import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateVideoRequest } from '@video-dashboard/shared-types';

export const videoApi = createApi({
  reducerPath: 'videoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: ['Video'],
  endpoints: builder => ({
    createVideo: builder.mutation<CreateVideoRequest, CreateVideoRequest>({
      query: video => ({
        url: '/videos',
        method: 'POST',
        body: video,
      }),
      invalidatesTags: ['Video'],
    }),
  }),
});

export const { useCreateVideoMutation } = videoApi;
