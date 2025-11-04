import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface JupiterPrice {
  id: string;
  mintSymbol?: string;
  vsToken?: string;
  vsTokenSymbol?: string;
  price: number;
}

interface JupiterResponse {
  data: {
    [key: string]: JupiterPrice;
  };
  timeTaken?: number;
}

export const pricesApi = createApi({
  reducerPath: 'pricesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/prices' }),
  endpoints: (builder) => ({
    getPrice: builder.query<JupiterResponse, string>({
      query: (mintAddress) => `/jupiter?ids=${mintAddress}`,
    }),
  }),
});

export const { useGetPriceQuery } = pricesApi;