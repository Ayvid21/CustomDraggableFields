import React, { useState, useRef } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./BalanceDetail.css";
import FieldCard from "./FieldCard";

const BalanceDetail = () => {
  // State to keep track of the layout of the grid
  const [layout, setLayout] = useState([]);

  // List of widgets that can be dragged and dropped
  const widgets = [
    { title: "Claim Status", subtitle: "Status of the claim" },
    { title: "Patient First Name", subtitle: "Patient's First Name" },
    { title: "Patient Last Name", subtitle: "Patient's Last Name" },
    { title: "Provider Name", subtitle: "Name of the provider" },
  ];

  // Reference to the grid container
  const gridRef = useRef(null);

  // Function to handle the adding of a new widget to the grid layout
  const handleDrop = (widget, x, y) => {

    // Create a new item with a unique id and position
    const newItem = {
      i: `${widget.title} ${
        layout.filter((item) => item.i.startsWith(widget.title)).length + 1
      }`,
      x: Math.round(x),
      y: Math.round(y),
      w: 4,
      h: 2,
      minW: 2,
      maxW: 6,
      resizeHandles: ["e", "w"],
    };

    // Update the layout state with the new item
    setLayout((prevLayout) => [...prevLayout, newItem]);
  };

  // Function for layout changes (dragging/resizing)
  const onLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  // calculating the position where the element is placed on the page area
  // or
  // Function to calculate the drop position based on mouse coordinates
  const calculateDropPosition = (clientX, clientY) => {
    const grid = gridRef.current;
    const gridRect = grid.getBoundingClientRect();

     // Calculate column width and row height  
    const colWidth = gridRect.width / 12; // Number of columns
    const rowHeight = 30; // Height of each row

    // Calculate the exact x, y location in terms of grid coordinates 
    const x = Math.floor((clientX - gridRect.left) / colWidth);
    const y = Math.floor((clientY - gridRect.top) / rowHeight);

    return { x, y };
  };

  //here widget means the name of the element picked and dropped
  // User drags a widget (like "Claim Status") from the list of widgets. onDragStart sets the data with key "widget" and the corresponding widget object as the value.
  // User drops the widget in the designated area. drop event handler retrieves the data which is set during the drag start using "e.dataTransfer.getData("widget")"
  //The retrieved widget object is then used to create a new item to the grid layout with the properties (e.g. position and size).

  // onDragOver -> By default, elements do not allow drop operations. When we drag an element over another element, the browser's default behavior is to not allow dropping. The e.preventDefault() call inside the onDragOver handler prevents the default action, making the element a valid drop target.
  return (
    <div className="App">
      <div
        className="page"
        onDrop={(e) => {
          e.preventDefault();
          const widget = JSON.parse(e.dataTransfer.getData("widget"));
          const { x, y } = calculateDropPosition(e.clientX, e.clientY);
          handleDrop(widget, x, y);
        }}
        onDragOver={(e) => e.preventDefault()}
        ref={gridRef}
      >
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1200}
          onLayoutChange={onLayoutChange}
          isResizable={true}
          isDraggable={true}
          autoSize={true}
        >
          {layout.map((item) => {
            const widget = widgets.find((w) => item.i.startsWith(w.title));

            return (
              <div key={item.i} data-grid={item} className="grid-item">
                {widget ? (
                  <FieldCard title={widget.title} subtitle={widget.subtitle} />
                ) : (
                  <div>Unknown Widget</div>
                )}
              </div>
            );
          })}
        </GridLayout>
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

export default BalanceDetail;