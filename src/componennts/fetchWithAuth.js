export const fetchWithAuth = async (url, options = {}, removeCookie) => {
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
  