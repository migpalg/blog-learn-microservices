import PropTypes from "prop-types";
import clsx from "clsx";

/**
 *
 * @param {import('react').ComponentProps<'button'>} param0
 * @returns
 */
export const Button = ({
  className,
  children,
  fullWidth,
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={clsx(
        "bg-indigo-500",
        "rounded-lg",
        "text-white",
        "py-2",
        "px-4",
        "shadow-md",
        "font-light",
        "block",
        {
          "w-full": fullWidth,
          "opacity-80": disabled,
          "hover:bg-indigo-600": !disabled,
        },
        className
      )}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
};
