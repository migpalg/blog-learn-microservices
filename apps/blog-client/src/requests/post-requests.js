import { postsClient } from "../core/client";

/**
 *
 * @param {import('axios').AxiosInstance} client
 */
export const createPostsRequests = (client) => ({
  /**
   * Get all posts in the backend
   * @returns {Promise<{id: string, updatedAt: string, title: string, content: string}[]>}
   */
  getPosts: async () => {
    const response = await client.get("/posts");

    return response.data;
  },

  /**
   * Creates a post in the backend
   * @param {object} post Post to be created
   * @param {string} post.title Title of the post
   * @param {string} post.content Content of the post
   * @returns The created object
   */
  createPost: async (post) => {
    const response = await client.post("/posts", post);

    return response.data;
  },
});

export const postsRequests = createPostsRequests(postsClient);
