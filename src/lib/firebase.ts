// Mock Firebase Auth for development/demo purposes
// Replace this with actual firebase initialization later
export const auth = {};

export const signInWithEmailAndPassword = async (authObj: any, email: string, password: string) => {
  return {
    user: {
      getIdToken: async () => "mock-id-token-12345",
      uid: "mock-uid-12345",
      email: email,
    }
  };
};

export const createUserWithEmailAndPassword = async (authObj: any, email: string, password: string) => {
  return {
    user: {
      getIdToken: async () => "mock-id-token-12345",
      uid: "mock-uid-12345",
      email: email,
    }
  };
};
