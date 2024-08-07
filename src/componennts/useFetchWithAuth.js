import { useCookies } from 'react-cookie';
import { fetchWithAuth } from './fetchWithAuth';

const useFetchWithAuth = () => {
  const [cookies, , removeCookie] = useCookies(['token']);
  
  const fetchWithAuthWrapper = async (url, options = {}) => {
    return fetchWithAuth(url, options, removeCookie);
  };

  return { fetchWithAuth: fetchWithAuthWrapper, token: cookies.token };
};

export default useFetchWithAuth;
