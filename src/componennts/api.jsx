import { useCookies } from 'react-cookie';
import { useEffect } from 'react';
import { logger } from '../logger';

// Custom hook for authentication and handling cookies
const useAuthFetch = () => {
  const [cookies, , removeCookie] = useCookies(['token']);

  const fetchWithAuth = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);

      if (response.status === 401) {
        removeCookie('token', { path: '/' });
        window.location.href = '/sign-in';
        throw new Error('Unauthorized');
      }

      return response;
    } catch (error) {
      console.error('Error in fetchWithAuth:', error);
      throw error;
    }
  };

  return { fetchWithAuth, token: cookies.token };
};

const loadDataFetch = async (id, apiBaseUrl, fetchWithAuth) => {
  try {
    logger.log(`${apiBaseUrl}user/load?secret=${id}`);
    const response = await fetchWithAuth(
      `${apiBaseUrl}user/load?secret=${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        name: data.name,
        email: data.email,
      };
    } else {
      console.error('Error loadDataFetch:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error loadDataFetch:', error);
    throw error;
  }
};

const saveDataToApi = async (id, requestBody, apiBaseUrl, fetchWithAuth) => {
  try {
    logger.log(requestBody);
    requestBody.language = 'de';
    const response = await fetchWithAuth(`${apiBaseUrl}user/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Error saving data:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

const heatmapFetch = async (data, apiBaseUrl, fetchWithAuth) => {
  try {
    const res = await fetchWithAuth(`${apiBaseUrl}heatmap/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.error('Error heatmapFetch:', res.statusText);
      throw new Error(res.statusText);
    }
  } catch (error) {
    console.error('Error heatmapFetch:', error);
    throw error;
  }
};

const heatmapStatusFetch = async (result, apiBaseUrl, fetchWithAuth) => {
  try {
    const res_heatmap = await fetchWithAuth(`${apiBaseUrl}heatmap/task_status/${result.task_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res_heatmap.ok) {
      const data = await res_heatmap.json();
      return data;
    } else {
      console.error('Error heatmapStatusFetch:', res_heatmap.statusText);
      throw new Error(res_heatmap.statusText);
    }
  } catch (error) {
    console.error('Error heatmapStatusFetch:', error);
    throw error;
  }
};

const CategoriesFetch = async (apiBaseUrl, fetchWithAuth) => {
  try {
    const response = await fetchWithAuth(`${apiBaseUrl}category-collections/`);

    if (response.ok) {
      const data = await response.json();
      const transformedData = {};

      data.forEach((item) => {
        const categoryName = item.title;
        const subcategories = item.categories.map((sub) => ({
          name: sub.title,
          ...sub,
        }));

        transformedData[categoryName] = subcategories;
      });

      logger.log(transformedData);
      return transformedData;
    } else {
      console.error('Error getting categories:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

const AdressFetch = async (value, apiBaseUrl, token, fetchWithAuth) => {
  try {
    const response = await fetchWithAuth(
      `${apiBaseUrl}addresses/?fullAdress__ilike=${value}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      logger.log(response);
      const data = await response.json();
      logger.log(data);
      return data;
    } else {
      console.error('Error getting address:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error getting addresses from searchbar:', error);
    throw error;
  }
};

const ObjectFetch = async (value, apiBaseUrl, fetchWithAuth) => {
  try {
    const response = await fetchWithAuth(
      `${apiBaseUrl}object/?partial_name=${value}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Error getting object from coordinates:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error getting object from searchbar:', error);
    throw error;
  }
};

const ReportFetch = async (report_id, apiBaseUrl, token, fetchWithAuth) => {
  try {
    logger.log(report_id);
    logger.log(`${apiBaseUrl}report/${report_id}`);
    const response = await fetchWithAuth(`${apiBaseUrl}report/${report_id}`, {
      method: 'GET',
      headers: {
        accept: 'application/json+geojson',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      logger.log(data);
      return data;
    } else {
      console.error('Error getting report:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error getting object from searchbar:', error);
    throw error;
  }
};

const ReportIdFetch = async (requestBody, apiBaseUrl, token, fetchWithAuth) => {
  try {
    logger.log(requestBody);
    logger.log(`${apiBaseUrl}report/`);
    const response = await fetchWithAuth(`${apiBaseUrl}report/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      logger.log(data);
      return data;
    } else {
      console.error('Error getting report:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error getting object from searchbar:', error);
    throw error;
  }
};

const RegistrationFetch = async (apiBaseUrl, requestBody, fetchWithAuth) => {
  try {
    logger.log(requestBody);
    const response = await fetchWithAuth(`${apiBaseUrl}users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      logger.log(data);
      return data;
    } else {
      console.error('Error getting report:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error getting object from searchbar:', error);
    throw error;
  }
};

const LoginFetch = async (apiBaseUrl, requestBody, fetchWithAuth) => {
  try {
    logger.log(requestBody);

    // Convert requestBody to URL-encoded format
    const urlEncodedData = new URLSearchParams(requestBody).toString();

    const response = await fetchWithAuth(`${apiBaseUrl}users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlEncodedData,
    });
    logger.log(response);
    if (response.ok) {
      const data = await response.json();
      logger.log(data);
      return data;
    } else {
      console.error('Error getting report:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error getting object from searchbar:', error);
    throw error;
  }
};

const UserFetch = async (apiBaseUrl, token, fetchWithAuth) => {
  try {
    const response = await fetchWithAuth(
      `${apiBaseUrl}users/me`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      logger.log(data);
      return data;
    } else {
      console.error('Error getting object from coordinates:', response.statusText);
      throw new Error(response.statusText);
    }
  } catch (error) {
    console.error('Error getting object from searchbar:', error);
    throw error;
  }
};

export {
  useAuthFetch,
  loadDataFetch,
  saveDataToApi,
  heatmapFetch,
  heatmapStatusFetch,
  CategoriesFetch,
  AdressFetch,
  ObjectFetch,
  ReportFetch,
  ReportIdFetch,
  RegistrationFetch,
  LoginFetch,
  UserFetch,
};
