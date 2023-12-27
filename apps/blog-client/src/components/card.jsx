import clsx from "clsx";
import PropTypes from "prop-types";

export const Card = ({ children, className }) => {
  return (
    <div
      className={clsx("shadow-md", "p-4", "rounded-lg", "border", className)}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
