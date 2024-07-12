import { logger } from '../logger';

export const loadDataFetch = async (id, apiBaseUrl) => {
    try {
      console.log(`${apiBaseUrl}user/load?secret=${id}`);
      const response = await fetch(
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
        return data;
      } else {
        console.error('Error loadDataFetch:', response.statusText);
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error loadDataFetch:', error);
      throw error;
    }
  };
  
  export const saveDataToApi = async (id, requestBody, apiBaseUrl) => {
    try {
      logger.log(requestBody);
      requestBody.language = "de"
      const response = await fetch(`${apiBaseUrl}user/save`, {
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

  export const heatmapFetch = async (data, apiBaseUrl) => {
    try {
        const res = await fetch(`${apiBaseUrl}heatmap/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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

  export const heatmapStatusFetch = async (result, apiBaseUrl) => {
    try {
        const res_heatmap = await fetch(`${apiBaseUrl}heatmap/task_status/${result.task_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
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

  export const CategoriesFetch = async (apiBaseUrl) => {
    try {
        const response = await fetch(`${apiBaseUrl}categories/`);

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Error getting categories:', response.statusText);
            throw new Error(response.statusText);
        }
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  };

  export const AdressFetch = async (value, apiBaseUrl) => {
    try {
        const response = await fetch(
            `${apiBaseUrl}address/?name=${value}`,
            {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                }, // Zamień dane na format JSON
            },
            );
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error(
                'Error getting address:',
                response.statusText,
            );
            throw new Error(response.statusText);
        }
    } catch (error) {
      console.error('Error getting addresses from searchbar:', error);
      throw error;
    }
  };

  export const ObjectFetch = async (value, apiBaseUrl) => {
    try {
        const response = await fetch(
            `${apiBaseUrl}object/?partial_name=${value}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              }, // Zamień dane na format JSON
            },
          );
          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            console.error(
              'Error getting object from coordinates:',
              response.statusText,
            );
            throw new Error(response.statusText);
          }
    } catch (error) {
      console.error('Error getting object from searchbar:', error);
      throw error;
    }
  };

  export const ReportFetch = async (requestBody, apiBaseUrl) => {
    try {
        logger.log(requestBody);
        const response = await fetch(`${apiBaseUrl}report/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
  
          if (response.ok) {
            const data = await response.json();
            logger.log(data)
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