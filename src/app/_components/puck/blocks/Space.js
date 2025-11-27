import React from "react";
import styles from "./Space.module.css";

const spacingOptions = [
  { label: "8px", value: "8px" },
  { label: "16px", value: "16px" },
  { label: "24px", value: "24px" },
  { label: "32px", value: "32px" },
  { label: "40px", value: "40px" },
  { label: "48px", value: "48px" },
  { label: "64px", value: "64px" },
  { label: "80px", value: "80px" },
  { label: "96px", value: "96px" },
];

export const Space = {
  label: "Space",
  fields: {
    size: {
      type: "select",
      options: spacingOptions,
    },
    direction: {
      type: "radio",
      options: [
        { value: "vertical", label: "Vertical" },
        { value: "horizontal", label: "Horizontal" },
        { value: "", label: "Both" },
      ],
    },
  },
  defaultProps: {
    direction: "",
    size: "24px",
  },
  inline: true,
  render: ({ direction, size, puck }) => {
    const className = direction
      ? `${styles.Space} ${styles[`Space--${direction}`]}`
      : styles.Space;

    return (
      <div
        ref={puck.dragRef}
        className={className}
        style={{ "--size": size }}
      />
    );
  },
};
