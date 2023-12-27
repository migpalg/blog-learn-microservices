import clsx from "clsx";
import PropTypes from "prop-types";
import { Comment } from "./comment";

export const CommentsList = ({ className, comments }) => {
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
  className: PropTypes.string,
  comments: PropTypes.array,
};
