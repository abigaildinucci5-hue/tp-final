import { useAuth as useAuthContext } from '../contexto/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;