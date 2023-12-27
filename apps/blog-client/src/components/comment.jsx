import clsx from "clsx";
import PropTypes from "prop-types";

export const Comment = ({ content, date }) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={clsx("flex", "gap-2")}>
      <img
        className={clsx("w-8", "h-8", "rounded-full", "block")}
        src="https://picsum.photos/seed/picsum/200"
        alt="User avatar"
      />
      <div>
        <span className={clsx("text-sm", "font-bold", "block")}>John Doe</span>
        <span
          className={clsx(
            "text-xs",
            "font-light",
            "block",
            "mb-1",
            "opacity-50"
          )}
        >
          {formattedDate}
        </span>
        <p className={clsx("text-sm", "font-light")}>{content}</p>
      </div>
    </div>
  );
};

Comment.propTypes = {
  content: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
