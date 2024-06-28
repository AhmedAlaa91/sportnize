import createAxiosInstance from '../axios/axiosInstance';

export const registerNewUser = async (body) => {
    const axiosInstance = await createAxiosInstance();
    return axiosInstance.post('/create/user', {
      ...body,
    });
  };