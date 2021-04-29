import React, { useCallback, useEffect, useState } from "react";
import { Button, Container, Navbar }               from "react-bootstrap";
import Nav                                         from "react-bootstrap/Nav";
import { Link }                                    from "react-router-dom";
import { useLocalStorage }                         from "react-use";
import LabelDetails                                from "../componenets/LabelDetails";
import LabelRow                                    from "../componenets/LabelRow";

export default function Labels() {
  const [modal, setModal] = useState();
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

  const onSave = useCallback(
    (label, oldLabel) => {
      setModal(null);
      const { labels } = value;
      const _labels = {};
      labels.push(label);
      labels.forEach((_label) => {
        if (_label.label === oldLabel && _label.label !== label) {
          return (_label = null);
        }
        return (_labels[_label.label] = _label);
      });

      setValue({ labels: Object.values(_labels) });
    },
    [value, setValue, setModal]
  );

  const onDelete = useCallback(
    (label) => {
      setModal(null);
      const { labels } = value;
      const _labels = {};
      labels.forEach((_label) =>
        _label.label !== label.label ? (_labels[_label.label] = _label) : null
      );

      setValue({ labels: Object.values(labels) });
    },
    [value, setValue, setModal]
  );

  const editNewLabel = useCallback(
    (label) => {
      setModal(
        <LabelDetails
          onSave={onSave}
          onDelete={onDelete}
          setModal={setModal}
          {...label}
        />
      );
    },
    [onSave, onDelete]
  );

  return (
    <Container fluid>
      {modal}
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Labels</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" />
          <Button
            variant="primary"
            onClick={() => editNewLabel({ label: "", color: "#000" })}
          >
            Add label
          </Button>
          <Link className="nav-link" to="/">
            Home
          </Link>
        </Navbar.Collapse>
      </Navbar>
      <div className="mt-5 mr-5 ml-5">
        {value?.labels?.map(({ color, label }) => (
          <LabelRow
            key={label}
            label={label}
            color={color}
            onEdit={() => editNewLabel({ color, label })}
          />
        ))}
      </div>
    </Container>
  );
}
