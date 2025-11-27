import React from "react";
import styles from "./Flex.module.css";

export const Flex = {
  fields: {
    direction: {
      label: "Direction",
      type: "radio",
      options: [
        { label: "Row", value: "row" },
        { label: "Column", value: "column" },
      ],
    },
    justifyContent: {
      label: "Justify Content",
      type: "radio",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
      ],
    },
    gap: {
      label: "Gap",
      type: "number",
      min: 0,
    },
    wrap: {
      label: "Wrap",
      type: "radio",
      options: [
        { label: "true", value: "wrap" },
        { label: "false", value: "nowrap" },
      ],
    },
    items: {
      type: "slot",
    },
  },
  defaultProps: {
    justifyContent: "start",
    direction: "row",
    gap: 24,
    wrap: "wrap",
    items: [],
  },
  render: ({ justifyContent, direction, gap, wrap, items: Items }) => {
    return (
      <Items
        className={styles.Flex}
        style={{
          justifyContent,
          flexDirection: direction,
          gap: `${gap}px`,
          flexWrap: wrap,
        }}
        collisionAxis={direction === "row" ? "x" : "y"}
      />
    );
  },
};
