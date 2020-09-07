import fetchApi, { defaultHeaders } from 'utils/fetchApi';
import { CardOptionsResponse, ErrorResponse } from 'interfaces/http';

export const fetchCardOptions = () =>
  fetchApi<CardOptionsResponse | ErrorResponse>('/cards/options/', {
    method: 'GET',
    headers: {
      ...defaultHeaders,
    },
  });