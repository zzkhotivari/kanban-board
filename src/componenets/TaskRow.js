import { useDrag }   from "react-dnd";
import TaskRowStyles from "../styles/TaskRow.module.scss";

export default function TaskRow({ title, body, label, onDrag, onClick }) {
  const [{ isDragging }, drag] = useDrag({
    item: { title, type: "task_row" },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDrag(dropResult.name);
      }
    },
  });

  return (
    <div
      ref={drag}
      className={TaskRowStyles.container}
      onClick={onClick}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <div>{title}</div>
      <div>{body}</div>
      {!label || label === "none" ? null : (
        <div className="text-right">
          <span
            style={{ background: label.color }}
            className={TaskRowStyles.label}
          >
            {label.label}
          </span>
        </div>
      )}
    </div>
  );
}
