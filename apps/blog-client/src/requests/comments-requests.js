import { commentsClient } from "../core/client";

/**
 * Creates a comments request object
 * @param {import('axios').AxiosInstance} client
 * @returns
 */
export const createCommentsRequests = (client) => ({
  /**
   * Get all comments in the backend
   * @param {string} postId
   * @returns an array with the comments of the post
   */
  getCommentsByPostId: async (postId) => {
    const response = await client.get(`/posts/${postId}/comments`);

    return response.data;
  },

  createComment: async (postId, comment) => {
    const response = await client.post(`/posts/${postId}/comments`, comment);

    return response.data;
  },
});

export const commentsRequests = createCommentsRequests(commentsClient);
