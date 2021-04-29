import React, { useState } from "react";
import { Button }          from "react-bootstrap";
import { SketchPicker }    from "react-color";
import { useDebounce }     from "react-use";

export default function ColorPicker({ initialColor, onChange }) {
  const [show, setShow]   = useState(false);
  const [color, setColor] = useState(initialColor);

  useDebounce(() => onChange(color), 500, [color]);

  const popover = {
    position: "absolute",
    zIndex: "2",
  };
  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  return (
    <div>
      <Button variant="link" onClick={() => setShow(true)}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            background: color,
          }}
        />
      </Button>
      {show ? (
        <div style={popover}>
          <div style={cover} onClick={() => setShow(false)} />
          <SketchPicker
            color={color}
            onChange={({ hex: color }) => setColor(color)}
          />
        </div>
      ) : null}
    </div>
  );
}
