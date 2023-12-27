import clsx from "clsx";
import { useQuery } from "react-query";
import { Post } from "../components/post";
import { Card } from "../components/card";
import { CommentsList } from "../components/comments-list";
import { CreateCommentForm } from "../wrappers/create-comment-form";
import { queryRequests } from "../requests/query-requests";

export const ListPostsScreen = () => {
  const { data, isLoading, error } = useQuery(
    "get-posts-with-comments",
    queryRequests.getPostsWithComments
  );

  const posts = data?.data;

  if (error) {
    return (
      <div
        className={clsx(
          "w-full",
          "h-20",
          "bg-red-600",
          "rounded-lg",
          "flex",
          "justify-center",
          "items-center",
          "flex-col",
          "text-white"
        )}
      >
        <h2 className={clsx("text-lg", "font-bold")}>Something went wrong</h2>
        <p>Please try again</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={clsx(
          "w-full",
          "h-40",
          "bg-slate-300",
          "rounded-lg",
          "animate-pulse"
        )}
      />
    );
  }

  if (!posts?.length) {
    return (
      <div
        className={clsx(
          "w-full",
          "h-20",
          "bg-white",
          "rounded-lg",
          "flex",
          "justify-center",
          "items-center",
          "flex-col",
          "border-2",
          "border-slate-300"
        )}
      >
        <h2 className={clsx("text-lg", "font-bold")}>No posts yet</h2>
        <p>Be the first to create one</p>
      </div>
    );
  }

  return (
    <div className={clsx("flex", "flex-col", "gap-6")}>
      {posts.map((post) => (
        <Card key={post.id}>
          <Post
            title={post.title}
            content={post.content}
            date={post.updatedAt}
          />
          <CommentsList
            comments={post.comments}
            className={clsx("mt-4", "pl-4")}
          />
          <CreateCommentForm postId={post.id} className="mt-4" />
        </Card>
      ))}
    </div>
  );
};
