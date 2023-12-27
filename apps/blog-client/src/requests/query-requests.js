import { queryClient } from "../core/client";

/**
 * Creates an object with all the query requests
 * @param {import('axios').AxiosInstance} client
 * @returns
 */
export const createQueryRequests = (client) => ({
  getPostsWithComments: async () => {
    const result = await client.get("/query/posts");

    return result.data;
  },
});

export const queryRequests = createQueryRequests(queryClient);
