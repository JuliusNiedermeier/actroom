type SafelySuccess<T> = {
  success: true;
  data: T;
  error: null;
};

type SafelyError = {
  success: false;
  data: null;
  error: unknown;
};

export const safely = async <T>(
  promise: Promise<T>
): Promise<SafelySuccess<Awaited<T>> | SafelyError> => {
  try {
    const data = await promise;
    return { data, error: null, success: true };
  } catch (error) {
    return { data: null, error, success: false };
  }
};
