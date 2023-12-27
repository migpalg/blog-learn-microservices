import clsx from "clsx";
import PropTypes from "prop-types";
import { useQuery } from "react-query";
import { Comment } from "../components/comment";
import { commentsRequests } from "../requests/comments-requests";

export const CommentsList = ({ className, postId }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["get-post-comments", postId],
    queryFn: () => commentsRequests.getCommentsByPostId(postId),
  });
  const comments = data?.data;

  if (error) {
    return (
      <div
        className={clsx(
          "w-full",
          "h-10",
          "bg-red-600",
          "rounded-lg",
          "flex",
          "justify-center",
          "items-center",
          "flex-col",
          "text-white",
          className
        )}
      >
        <p>Cannot load comments</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={clsx(
          "w-full",
          "h-10",
          "bg-slate-300",
          "rounded-lg",
          "animate-pulse",
          className
        )}
      />
    );
  }

  if (!comments?.length) {
    return (
      <div
        className={clsx(
          "w-full",
          "h-10",
          "bg-white",
          "rounded-lg",
          "flex",
          "justify-center",
          "items-center",
          "flex-col",
          "border-2",
          className
        )}
      >
        <p className={clsx("opacity-50", "font-light", "text-sm")}>
          No comments yet
        </p>
      </div>
    );
  }

  return (
    <div className={clsx("flex", "flex-col", "gap-4", className)}>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          content={comment.content}
          date={comment.updatedAt}
        />
      ))}
    </div>
  );
};

CommentsList.propTypes = {
  postId: PropTypes.string.isRequired,
  className: PropTypes.string,
};
