export const FRONTEND_FETCH_WAITING_TIMEOUT = 10000;

export function requestWithTimeout<Res>(
  fetchPromise: Promise<Res>,
  config?: {
    timeout: number;
  }
): Promise<Res> {
  const timeoutPromise = new Promise((_, reject) => {
    if (config?.timeout) {
      setTimeout(() => {
        reject(new Error('timeout'));
      }, config?.timeout);
    }
  });
  return Promise.race([timeoutPromise, fetchPromise]) as Promise<Res>;
}
