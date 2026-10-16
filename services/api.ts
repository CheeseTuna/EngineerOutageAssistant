const API_JOBS_URL = 'https://engineeroutageassistant-api.onrender.com/api/jobs';

export const getJobs = async () => {

  const response = await fetch(
    `${API_JOBS_URL}`
  );

  const data = await response.json();

  return data;
};
