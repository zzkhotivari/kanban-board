import React, { useState }     from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import LabelRow                from "./LabelRow";
import Modal                   from "./Modal";

export default function LabelDetails({
  label,
  color,
  setModal,
  onSave,
  onDelete,
}) {
  const [_color, setColor] = useState(color);
  const [_label, setLabel] = useState(label);

  return (
    <Modal onHide={() => setModal(null)}>
      <div>
        <div className="mb-5 text-right">{!label ? "New" : "Edit"} Label</div>
        <LabelRow
          label={_label}
          color={_color}
          edit={true}
          onColorChange={setColor}
          onLabelChange={setLabel}
        />
        <div className="mt-5">
          <ButtonGroup>
            <Button variant="info" onClick={() => setModal(null)}>
              Cancel
            </Button>
            {label ? (
              <Button
                variant="danger"
                onClick={() => onDelete({ label: _label, color: _color })}
              >
                Deleted
              </Button>
            ) : null}
            <Button
              variant="success"
              onClick={() => onSave({ label: _label, color: _color }, label)}
            >
              {!label ? "New" : "Edit"}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </Modal>
  );
}
