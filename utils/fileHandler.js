import apiReq from "./axiosReq";

export const uploadFile = async (img) => {
  try {
    const data = new FormData();
    data.append('my_file', img);

    const res = await apiReq.post('/api/file/upload', data);
    return res.data;
  } catch (error) {
    console.log('Error: ', error);
  }
};

export const deleteFile = async (publicId) => {
  try {
    const response = await apiReq.post('api/file/delete', {publicId});
    return response.data.success;
  } catch (error) {
    console.error(error);
  }
};
