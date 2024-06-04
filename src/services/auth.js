import { useRoute } from 'vue-router'
import { userDataStore } from '@/store/userStore'


/**
 * Retrieves the current route path and checks if the user's token is stored.
 * If a token exists, it returns the token and the path; otherwise, it returns null and the path.
 * @returns {[string | null, string]} A tuple containing the user's token or null and the current route path.
 */
export const getTokenAndPath = () => {
  const route = useRoute().path;
  const store = userDataStore();

  return store.token !== '' ? [store.token, route] : [null, route];
}

export const manageResponse = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data; // Return the data from the response
  } else {
    // Throw an error with the status code and status text
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
}
