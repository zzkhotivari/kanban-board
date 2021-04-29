import { endOfDay, isAfter, isBefore, parseISO }            from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Container, Form, Navbar, Row }        from "react-bootstrap";
import Nav                                                  from "react-bootstrap/Nav";
import DatePicker                                           from "react-datepicker";
import { useDrop }                                          from "react-dnd";
import { Link }                                             from "react-router-dom";
import { useLocalStorage }                                  from "react-use";
import TaskDetails                                          from "../componenets/TaskDetails";
import TaskRow                                              from "../componenets/TaskRow";
import HomeStyles                                           from "../styles/Home.module.scss";

export default function Home() {
  const [modal, setModal]           = useState();
  const [filterDate, setFilterDate] = useState(false);
  const [startDate, setStartDate]   = useState(new Date());
  const [endDate, setEndDate]       = useState(new Date());
  const [search, setSearch]         = useState("");
  const [value, setValue]           = useLocalStorage("tasks", "init");

  useEffect(() => {
    if (value === "init") {
      setValue({
        tasks: [],
      });
    }
  }, [value, setValue]);

  const onSave = useCallback(
    (task, oldTitle) => {
      setModal(null);
      const { tasks } = value;
      const _tasks = {};
      tasks.push(task);
      tasks.forEach((_task) => {
        if (_task.title === oldTitle && task.title !== oldTitle) {
          return (_task = null);
        }
        return (_tasks[_task.title] = {
          ..._task,
          created: _task.created ? _task.created : new Date(),
          updated: new Date(),
        });
      });

      setValue({ tasks: Object.values(_tasks) });
    },
    [value, setValue, setModal]
  );

  const onDelete = useCallback(
    (task) => {
      setModal(null);
      const { tasks } = value;
      const _tasks = {};
      tasks.forEach((_task) =>
        _task.title !== task.title ? (_tasks[_task.title] = _task) : null
      );

      setValue({ tasks: Object.values(_tasks) });
    },
    [value, setValue, setModal]
  );

  const editNewTask = useCallback(
    (task) => {
      setModal(
        <TaskDetails
          onSave={onSave}
          onDelete={onDelete}
          setModal={setModal}
          {...task}
        />
      );
    },
    [onDelete, onSave, setModal]
  );

  const onDragTask = useCallback(
    (_task, draggedTo) => {
      _task.type = draggedTo;
      onSave(_task);
    },
    [onSave]
  );

  const { tasks } = value;

  const [backlog, progresses, done] = useMemo(() => {
    const backlog = [];
    const progresses = [];
    const done = [];

    tasks?.forEach((task) => {
      const _taskRow = (
        <TaskRow
          key={task.title}
          {...task}
          onDrag={(draggedTo) => onDragTask(task, draggedTo)}
          onClick={() => editNewTask(task)}
        />
      );
      if (filterDate) {
        if (
          isAfter(parseISO(task.created), startDate) === false ||
          isBefore(parseISO(task.created), endDate) === false
        ) {
          return;
        }
      }

      if (search.length > 0) {
        if (
          task.title.toLowerCase().indexOf(search.toLowerCase()) === -1 &&
          task.body.toLowerCase().indexOf(search.toLowerCase()) === -1
        ) {
          return;
        }
      }

      if (task?.type?.toLowerCase() === "backlog") {
        backlog.push(_taskRow);
      } else if (task?.type?.toLowerCase() === "in progress") {
        progresses.push(_taskRow);
      } else if (task?.type?.toLowerCase() === "done") {
        done.push(_taskRow);
      }
    });

    return [backlog, progresses, done];
  }, [tasks, editNewTask, onDragTask, search, startDate, endDate, filterDate]);

  const [{ canDrop, isOver }, dropBacklog] = useDrop({
    accept: "task_row",
    drop: () => ({ name: "Backlog" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const [{ canDrop: canDrop1, isOver: isOver1 }, dropProgress] = useDrop({
    accept: "task_row",
    drop: () => ({ name: "In Progress" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const [{ canDrop: canDrop2, isOver: isOver2 }, dropDone] = useDrop({
    accept: "task_row",
    drop: () => ({ name: "Done" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Container fluid>
      {modal}
      <Navbar bg="light" expand="lg" className="justify-content-end">
        <Navbar.Brand href="/">Kanban Board</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" />
          <Link className="nav-link" to="/labels">
            Labels
          </Link>
          <Button
            variant="primary"
            onClick={() => editNewTask({ type: "Backlog" })}
          >
            Add Task
          </Button>
        </Navbar.Collapse>
      </Navbar>
      <div>
        <Form>
          <Row>
            <Col>
              <Form.Control
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col>
              <Row>
                <Col className="col-auto">
                  <Form.Check
                    value={filterDate}
                    onChange={() => setFilterDate(!filterDate)}
                  />
                </Col>
                <Col>
                  <DatePicker
                    dateFormat="Pp"
                    disabled={!filterDate}
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showTimeSelect
                  />
                </Col>
                <Col>
                  <DatePicker
                    dateFormat="Pp"
                    disabled={!filterDate}
                    minDate={startDate}
                    minTime={startDate}
                    maxTime={endOfDay(endDate)}
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    showTimeSelect
                  />
                </Col>
              </Row>
            </Col>
            <Col className="col-auto">
              <Button
                variant="info"
                onClick={() => {
                  setSearch("");
                  setStartDate(new Date());
                  setEndDate(new Date());
                  setFilterDate(false);
                }}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <Row className="mt-3">
        <Col>
          <div>
            <h3>Backlog</h3>
          </div>
          <div
            ref={dropBacklog}
            className={HomeStyles.taskRowFirst}
            style={{
              opacity: isOver ? 0.8 : 1,
              border: canDrop ? "2px solid red" : null,
            }}
          >
            {backlog}
          </div>
        </Col>
        <Col>
          <div>
            <h3>In Progress</h3>
          </div>
          <div
            ref={dropProgress}
            className={HomeStyles.taskRowSecond}
            style={{
              opacity: isOver1 ? 0.8 : 1,
              border: canDrop1 ? "2px solid red" : null,
            }}
          >
            {progresses}
          </div>
        </Col>
        <Col>
          <div>
            <h3>Done</h3>
          </div>
          <div
            ref={dropDone}
            className={HomeStyles.taskRowThird}
            style={{
              opacity: isOver2 ? 0.8 : 1,
              border: canDrop2 ? "2px solid red" : null,
            }}
          >
            {done}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
