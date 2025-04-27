import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const accessToken = Cookies.get('access_token');

  useEffect(() => {
    if (!accessToken) {
      router.push('/');
    }
  }, [accessToken]);

  return accessToken ? children : null;
};

export default ProtectedRoute;
