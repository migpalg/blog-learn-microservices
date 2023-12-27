import clsx from "clsx";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { commentsRequests } from "../requests/comments-requests";

export const CreateCommentForm = ({ className, postId }) => {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();
  const createComment = useMutation({
    mutationFn: async ({ postId, data }) => {
      await commentsRequests.createComment(postId, data);
      queryClient.invalidateQueries("get-posts-with-comments");
    },
  });

  const handleCreateComment = (data) => {
    createComment.mutate(
      { postId, data },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(handleCreateComment)}
      className={clsx("flex", "w-full", "gap-2", "items-stretch", className)}
    >
      <Input
        className="flex-1"
        placeholder="Write a comment"
        autoComplete="off"
        disabled={createComment.isLoading}
        {...register("content", { required: true })}
      />
      <Button
        type="submit"
        className={clsx("py-0", "shadow-none")}
        disabled={createComment.isLoading}
      >
        Send
      </Button>
    </form>
  );
};

CreateCommentForm.propTypes = {
  className: PropTypes.string,
  postId: PropTypes.string.isRequired,
};
