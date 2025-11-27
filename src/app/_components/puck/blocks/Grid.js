import React from "react";
import styles from "./Grid.module.css";

const CustomSlot = (props) => {
  return <span {...props} />;
};

export const Grid = {
  fields: {
    numColumns: {
      type: "number",
      label: "Number of columns",
      min: 1,
      max: 12,
    },
    gap: {
      label: "Gap",
      type: "number",
      min: 0,
    },
    items: {
      type: "slot",
    },
  },
  defaultProps: {
    numColumns: 4,
    gap: 24,
    items: [],
  },
  render: ({ gap, numColumns, items: Items }) => {
    return (
      <Items
        as={CustomSlot}
        className={styles.Grid}
        style={{
          gap: `${gap}px`,
          gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
        }}
      />
    );
  },
};
