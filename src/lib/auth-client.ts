export const useSession = () => {
  return {
    data: null,
    isPending: false,
    error: null,
  };
};

export const signIn = {
  social: async () => {
    console.warn('Social login disabled');
  },
};

export const signUp = async () => {};

export const signOut = async () => {
  localStorage.removeItem('jobnest_token');
  localStorage.removeItem('jobnest_user');
};

export const authClient = {
  useSession,
  signIn,
  signUp,
  signOut,
};
