import React, { useState, useRef } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Delete as DeleteIcon } from "@material-ui/icons";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./BalanceDetail.css";
import FieldCard from "./FieldCard";
import OverlayOne from "./OverlayOne";
// import OverlayTwo from "./OverlayTwo";

const ResponsiveGridLayout = WidthProvider(Responsive);

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480 };
const cols = { lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 };

function deleteAndShiftLeft(matrix, row, col) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Ensure the index is within bounds
  if (row < 0 || row >= rows || col < 0 || col >= cols) {
    throw new Error("Index out of bounds");
  }

  // Flatten the 2D array into a 1D array
  let flatArray = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      flatArray.push(matrix[r][c]);
    }
  }

  // Remove the element at the specified index
  const indexToRemove = row * cols + col;
  flatArray.splice(indexToRemove, 1);

  // Rebuild the 2D array
  const newMatrix = [];
  let k = 0;
  for (let r = 0; r < rows; r++) {
    newMatrix[r] = [];
    for (let c = 0; c < cols; c++) {
      newMatrix[r][c] = flatArray[k++];
    }
  }

  return newMatrix;
}

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}

function addElementAtIndex(matrix, rowIndex, colIndex, newItem) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Flatten the 2D array into a 1D array
  let flatArray = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      flatArray.push(matrix[r][c]);
    }
  }

  // Calculate the position to insert the new item
  const insertIndex = rowIndex * cols + colIndex;

  // Insert the new item at the specified index
  flatArray.splice(insertIndex, 0, newItem);

  // Rebuild the 2D array, creating new rows if necessary
  const newMatrix = [];
  for (let i = 0; i < flatArray.length; i += cols) {
    newMatrix.push(flatArray.slice(i, i + cols));
  }

  return newMatrix;
}

const ITEM_WIDTH = 2;

function create2DArray(rows, cols, value) {
  // Create a 2D array with the specified number of rows and columns, initialized to the given value
  return Array.from({ length: rows }, () => Array(cols).fill(value));
}

const widgets = [
  { title: "Claim Status", subtitle: "In Progress" },
  { title: "First Name", subtitle: "Divya" },
  { title: "Last Name", subtitle: "Rajpoot" },
  { title: "D.O.B", subtitle: "01-01-2000" },
  { title: "Provider Name", subtitle: "Avizva" },
];

const BalanceDetailResponsive = ({
  handleItemClick,
  isResizing,
  setIsResizing,
}) => {
  const [layout, setLayout] = useState([]);
  const gridRef = useRef(null);

  const handleDrop = (widget) => {
    console.log(gridRef.current);
    const gridCols = 12; // Total number of columns in the grid
    const itemWidth = ITEM_WIDTH; // Width of the item in columns
    const rowHeight = 2; // Height of the item in rows

    // Calculate the next available position
    let nextX = 0;
    let nextY = 0;

    if (layout.length > 0) {
      // Sort the layout by y and x to find the last placed item in the current row
      const sortedLayout = [...layout].sort((a, b) =>
        a.y === b.y ? a.x - b.x : a.y - b.y
      );
      console.log("sortedLayout: ", sortedLayout);
      const lastItem = sortedLayout[sortedLayout.length - 1];

      // Calculate the next x position
      nextX = lastItem.x + lastItem.w;
      nextY = lastItem.y;

      // Check if the next position exceeds the grid width
      if (nextX + itemWidth > gridCols) {
        // Move to the next row if the current row is full or if there's not enough space for the new item
        nextX = 0;
        nextY += rowHeight;
      }
    }

    // Create a new item with the calculated position
    const newItem = {
      i: `${widget.title}_${generateRandomString(10)}`,
      x: nextX,
      y: nextY,
      w: itemWidth,
      h: rowHeight,
      minW: 2,
      maxW: 4,
      resizeHandles: ["e", "w"],
    };

    // Update the layout state with the new item
    setLayout((prevLayout) => {
      // Calculate available space in the current row for all elements
      const newLayout = prevLayout.map((item) => {
        if (
          item.y === newItem.y &&
          item.x >= newItem.x &&
          item.x < newItem.x + newItem.w
        ) {
          // Shift existing items to the right if they overlap with the new item
          return { ...item, x: item.x + newItem.w };
        }
        return item;
      });

      return [...newLayout, newItem];
    });
  };

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeStop = (_, oldItem, newItem) => {
    setIsResizing(false);
    const array = create2DArrayFromLayout(layout);
    const col = oldItem.x / ITEM_WIDTH;
    const row = oldItem.y / ITEM_WIDTH;

    let newArray = [];
    const isReducing = oldItem.w > newItem.w;

    if (isReducing) {
      newArray = deleteAndShiftLeft(array, row, col + 1);
    } else {
      newArray = addElementAtIndex(array, row, col + 1, null);
    }

    const newLayout = createLayoutFrom2DArray(newArray);

    const index = newLayout.findIndex((item) => oldItem.i === item.i);
    newLayout[index] = {
      ...newLayout[index],
      w: newItem.w,
    };
    setLayout(newLayout);
  };

  const create2DArrayFromLayout = (layout) => {
    const array = create2DArray(3, 12 / ITEM_WIDTH, null);

    for (let i = 0; i < layout.length; i++) {
      const item = layout[i];
      const col = item.x / ITEM_WIDTH;
      const row = item.y / ITEM_WIDTH;

      if (Array.isArray(array[row])) {
        array[row][col] = item;
      } else {
        array[row] = [];
        array[row][col] = item;
      }
    }

    console.log("create2DArrayFromLayout", array);
    return array;
  };

  const createLayoutFrom2DArray = (array) => {
    const layout = [];

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i]?.length; j++) {
        const item = array[i][j];

        if (item !== undefined && item !== null) {
          layout.push({
            ...item,
            x: j * ITEM_WIDTH,
            y: i * ITEM_WIDTH,
          });
        }
      }
    }
    console.log("createLayoutFrom2DArray", layout);
    return layout;
  };

  const deleteItem = (layout, item) => {
    const array = create2DArrayFromLayout(layout);
    const col = item.x / ITEM_WIDTH;
    const row = item.y / ITEM_WIDTH;
    const newArray = deleteAndShiftLeft(array, row, col);
    return createLayoutFrom2DArray(newArray);
  };

  const handleDelete = (i) => {
    setLayout((prevLayout) => {
      const deletedItem = prevLayout.find((item) => item.i === i);
      const layout = deleteItem(prevLayout, deletedItem);
      return layout;
    });
  };

  return (
    <div
      className={"page"}
      onDrop={(e) => {
        e.preventDefault();
        const widget = JSON.parse(e.dataTransfer.getData("widget"));
        handleDrop(widget);
      }}
      onDragOver={(e) => e.preventDefault()}
      ref={gridRef}
    >
      <ResponsiveGridLayout
        className="layout"
        isBounded={false}
        layouts={{ lg: layout }}
        breakpoints={breakpoints}
        cols={cols}
        row={1}
        rowHeight={30}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        verticalCompact={true}
        isResizable={true}
        isDraggable={true}
        onDragStart={() => {
          setIsResizing(true);
        }}
        onDragStop={() => {
          setTimeout(() => {
            setIsResizing(false);
          }, 0);
        }}
        autoSize={true}
        measureBeforeMount={false}
        useCSSTransforms={true}
        preventCollision={false}
      >
        {layout.map((item) => {
          const widget = widgets.find((w) => item.i.startsWith(w.title));
          return (
            <div
              key={item.i}
              data-grid={item}
              className="grid-item"
              onClick={() => {
                if (!isResizing) {
                  handleItemClick(item);
                }
              }}
            >
              {widget ? (
                <>
                  <FieldCard title={widget.title} subtitle={widget.subtitle} />
                  <div
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.i);
                    }}
                  >
                    <DeleteIcon />
                  </div>
                </>
              ) : (
                <div>Unknown Widget</div>
              )}
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
};

const Component = () => {
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [isResizing, setIsResizing] = useState(false);

  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  const handleItemClick = (item) => {
    if (!isResizing) {
      if (item.i.startsWith("Claim")) {
        setActiveOverlay("overlayOne");
      } else {
        setActiveOverlay("overlayOne");
      }
    }
  };

  return (
    <div className="App">
      {activeOverlay === "overlayOne" && <OverlayOne onClose={closeOverlay} />}
      {activeOverlay === "overlayOne" && <OverlayOne onClose={closeOverlay} />}
      <div className="background">
        <div>
          <BalanceDetailResponsive
            handleItemClick={handleItemClick}
            isResizing={isResizing}
            setIsResizing={setIsResizing}
          />
          <BalanceDetailResponsive
            handleItemClick={handleItemClick}
            isResizing={isResizing}
            setIsResizing={setIsResizing}
          />
        </div>
      </div>
      <div className="widgets">
        {widgets.map((widget) => (
          <div
            key={widget.title}
            className="widget"
            draggable
            onDragStart={(e) =>
              e.dataTransfer.setData("widget", JSON.stringify(widget))
            }
          >
            <FieldCard title={widget.title} subtitle={widget.subtitle} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Component;