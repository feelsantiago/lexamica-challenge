import axios from 'axios';
import { HttpProvider } from './http-types';
import { Http } from './http';

export const httpProviders = [
  {
    token: HttpProvider,
    useFactory: () => axios,
  },
  {
    token: Http,
    useClass: Http,
  },
];
