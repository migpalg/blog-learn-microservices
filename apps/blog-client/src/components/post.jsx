import clsx from "clsx";
import PropTypes from "prop-types";

export const Post = ({ className, content, title, date }) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div className={className}>
      <h3 className={clsx("text-2xl", "font-bold")}>{title}</h3>
      <span
        className={clsx("text-xs", "font-light", "opacity-50", "mb-3", "block")}
      >
        {formattedDate}
      </span>
      <p className={clsx("text-md", "font-light")}>{content}</p>
    </div>
  );
};

Post.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
