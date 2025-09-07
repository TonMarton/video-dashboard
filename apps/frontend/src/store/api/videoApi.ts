import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CreateVideoRequest,
  GetVideosResponse,
  GetVideosQueryParams,
} from '@video-dashboard/shared-types';

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
    getVideos: builder.query<GetVideosResponse, GetVideosQueryParams>({
      query: params => ({
        url: '/videos',
        method: 'GET',
        params,
      }),
      providesTags: ['Video'],
      serializeQueryArgs: ({ queryArgs }) => {
        const { cursor, ...otherArgs } = queryArgs;
        return otherArgs;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.cursor) {
          return {
            ...newItems,
            items: [...currentCache.items, ...newItems.items],
          };
        }
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const { useCreateVideoMutation, useGetVideosQuery } = videoApi;
