import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Reads the JSON the backend exports into public/data/. Each feature adds its
// endpoints with dataApi.injectEndpoints, next to the feature's code.
export const dataApi = createApi({
  reducerPath: 'dataApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.BASE_URL}data/` }),
  endpoints: () => ({}),
})
