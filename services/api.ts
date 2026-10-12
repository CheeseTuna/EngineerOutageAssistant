const API_URL = 'http://192.168.0.118:5158/api/jobs';

export const getJobs = async () => {

  const response = await fetch(
    `${API_URL}`
  );

  const data = await response.json();

  return data;
};