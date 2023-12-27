import clsx from "clsx";
import PropTypes from "prop-types";
import { forwardRef } from "react";

/**
 * Custom input
 * @param {import('react').ComponentProps<'input'>} props
 */
export const Input = forwardRef(({ className, label, ...props }, ref) => {
  return (
    <div className={className}>
      <label
        className={clsx(
          "font-bold",
          "text-sm",
          "pl-2",
          "mb-0.5",
          "block",
          "w-full"
        )}
      >
        {label}
      </label>
      <input
        {...props}
        ref={ref}
        className={clsx(
          "block",
          "border-2",
          "focus:border-indigo-400",
          "focus:outline-none",
          "px-2",
          "py-1",
          "rounded-lg",
          "w-full"
        )}
      />
    </div>
  );
});

Input.displayName = "Input";

Input.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
};
