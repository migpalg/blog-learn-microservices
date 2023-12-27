import clsx from "clsx";
import { useState } from "react";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { postsRequests } from "../requests/post-requests";

export const CreatePostScreen = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [creatingPost, setCreatingPost] = useState(false);
  const createPost = useMutation({ mutationFn: postsRequests.createPost });

  const handleCreatePost = (data) => {
    setCreatingPost(true);
    createPost.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
      onSettled: () => {
        setCreatingPost(false);
      },
    });
  };

  return (
    <div>
      <h2 className={clsx("text-3xl", "font-black", "mb-6")}>
        Create a new post
      </h2>
      <form
        onSubmit={handleSubmit(handleCreatePost)}
        className={clsx("flex", "flex-col", "gap-4")}
      >
        <Input
          label="Title"
          type="text"
          placeholder="Type a title..."
          autoComplete="off"
          {...register("title", { required: "Title is required" })}
        />
        <Input
          label="Content"
          type="text"
          placeholder="Content of the post"
          autoComplete="off"
          {...register("content", { required: "Content is required" })}
        />
        <Button
          className="mt-4"
          type="submit"
          disabled={creatingPost}
          fullWidth
        >
          Create!
        </Button>
      </form>
    </div>
  );
};
