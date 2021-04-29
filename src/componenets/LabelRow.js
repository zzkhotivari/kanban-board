import React                      from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import ColorPicker                from "./ColorPicker";

export default function LabelRow({
  color,
  label,
  edit,
  onEdit,
  onColorChange,
  onLabelChange,
}) {
  return (
    <Row className="mt-5 justify-content-center align-items-center">
      <Col className="col-auto">
        {edit ? (
          <ColorPicker initialColor={color} onChange={onColorChange} />
        ) : (
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              background: color,
            }}
          />
        )}
      </Col>
      <Col>
        {edit ? (
          <Form.Control
            defaultValue={label}
            onChange={(e) => onLabelChange(e.target.value)}
          />
        ) : (
          label
        )}
      </Col>
      {!edit ? (
        <Col className="col-auto">
          <Button variant="warning" onClick={onEdit}>
            Edit
          </Button>
        </Col>
      ) : null}
    </Row>
  );
}
