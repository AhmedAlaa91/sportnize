import axios from 'axios';
import { getAccessToken } from '../utilities/helpers';
import * as log from 'loglevel';

//USE Varaiable in .env file

async function createAxiosInstance() {
  try {
    const baseURL = 'https://capturebackend.pythonanywhere.com/api';
    //const token = await getAccessToken();
    const instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
       // Authorization: `Bearer ${token}`,
      },
    });
    return instance;
  } catch (error) {
    log.error('Error creating Axios instance:', error);
    throw error; // Re-throw to allow handling in the calling component
  }
}

export default createAxiosInstance;
