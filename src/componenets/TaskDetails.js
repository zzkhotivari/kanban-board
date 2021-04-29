import { format, parseISO }                    from "date-fns";
import React, { useEffect, useState }          from "react";
import { Button, ButtonGroup, Col, Form, Row } from "react-bootstrap";
import Select, { components }                  from "react-select";
import { useLocalStorage }                     from "react-use";
import Modal                                   from "./Modal";

export default function TaskDetails({
  title,
  body,
  type,
  label,
  created,
  updated,
  setModal,
  onDelete,
  onSave,
}) {

  const [value, setValue] = useLocalStorage("labels", "init");

  useEffect(() => {
    if (value === "init") {
      setValue({
        labels: [
          { color: "#ffe6cc", label: "WIP" },
          { color: "#e1d5e7", label: "Waiting" },
          { color: "#dae8fc", label: "ASAP" },
        ],
      });
    }
  }, [value, setValue]);

  const { labels } = value;

  const ffs = [...labels?.map(({ label, color }) => ({
    value: label,
    label,
    color,
  }))];

  const [_title, setTitle] = useState(title);
  const [_body, setBody]   = useState(body);
  const [_type, setType]   = useState(type);
  const [_label, setLabel] = useState(label);

  return (
    <Modal onHide={() => setModal(null)}>
      <div style={{ minWidth: 600 }}>
        <Row className="justify-content-center align-items-center">
          <Col>
            <Form.Control
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={"title"}
            />
          </Col>
          <Col className="col-auto">
            {title ? "Editing/Preview" : "New Task"}
          </Col>
        </Row>
        <div className="mt-3">
          <Form.Control
            defaultValue={body}
            onChange={(e) => setBody(e.target.value)}
            as="textarea"
            rows={4}
          />
        </div>
        <Row>
          <Col>
            <div className="mt-3">
              <Select
                components={{
                  Option: ({ children, ...props }) => {
                    return (
                      <components.Option {...props}>
                        <Row className="justify-content-center align-items-center">
                          <Col className="col-auto">
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 5,
                                background: props?.data?.color,
                              }}
                            />
                          </Col>
                          <Col>{children}</Col>
                        </Row>
                      </components.Option>
                    );
                  },
                }}
                options={[
                  { label: "Backlog", color: "#f8cecc" },
                  { label: "In Progress", color: "#dae8fc" },
                  { label: "Done", color: "#d3e6d2" },
                ].map(({ label, color }) => ({
                  value: label,
                  label: label,
                  color,
                }))}
                onChange={(type) => setType(type.value)}
                defaultValue={{
                  value: type,
                  label: type,
                }}
              />
            </div>
            <div className="mt-3">
              <Select
                components={{
                  Option: ({ children, ...props }) => {
                    return (
                      <components.Option {...props}>
                        <Row className="justify-content-center align-items-center">
                          <Col className="col-auto">
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 5,
                                background: props?.data?.color,
                              }}
                            />
                          </Col>
                          <Col>{children}</Col>
                        </Row>
                      </components.Option>
                    );
                  },
                }}
                options={[
                  {
                    value: "none",
                    label: "None",
                    color: "#FFF",
                  },
                  ffs,
                ]}
                onChange={(label) => setLabel(label)}
                defaultValue={{
                  value: label?.value,
                  label: label?.label,
                  color: label?.color,
                }}
              />
            </div>
          </Col>
          <Col>
            <div className="mt-2" style={{ opacity: title ? 1 : 0 }}>
              <div>
                Created:{" "}
                <strong>
                  {created ? format(parseISO(created), "PPpp") : null}
                </strong>
              </div>
              <div>
                Updated:{" "}
                <strong>
                  {updated ? format(parseISO(updated), "PPpp") : null}
                </strong>
              </div>
            </div>
            <ButtonGroup className="mt-3">
              <Button variant="info" onClick={() => setModal(null)}>
                Cancel
              </Button>
              {title ? (
                <Button
                  variant="danger"
                  onClick={() => onDelete({ title: _title })}
                >
                  Delete
                </Button>
              ) : null}
              <Button
                variant="success"
                onClick={() =>
                  onSave(
                    {
                      title: _title,
                      body: _body,
                      type: _type,
                      label: _label,
                      created,
                    },
                    title
                  )
                }
              >
                {!title ? "New" : "Edit"}
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </div>
    </Modal>
  );
}
