import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import styled from "styled-components";
import data from "./data";
import "css-reset-and-normalize";

// Styles
const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgray;
  border-radius: 2px;
`;
const Title = styled.h3`
  padding: 8px;
`;
const TaskList = styled.div`
  padding: 8px;
`;
const TaskContainer = styled.div`
  border: 1px solid lightgray;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 2px;
  background-color: white;
`;

// Helper Functions
function reorderList(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

// Components
const Task = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {provided => (
        <TaskContainer
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {task.content}
        </TaskContainer>
      )}
    </Draggable>
  );
};

const Column = ({ column, tasks }) => {
  return (
    <Container>
      <Title>{column.title}</Title>
      <Droppable droppableId={column.id}>
        {provided => (
          <TaskList {...provided.droppableProps} ref={provided.innerRef}>
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
};

const App = () => {
  let [state, setState] = useState(() => data());
  const onDragEnd = result => {
    const { destination } = result;
    if (!destination) {
      return;
    }
    if (result.source.droppableId === result.destination.droppableId) {
      const column = state.columns[result.source.droppableId];
      const taskIds = reorderList(
        column.taskIds,
        result.source.index,
        result.destination.index
      );

      // updating column entry
      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [column.id]: {
            ...column,
            taskIds
          }
        }
      };
      setState(newState);
      return;
    }
    // moving between lists
    const sourceColumn = state.columns[result.source.droppableId];
    const destinationColumn = state.columns[result.destination.droppableId];
    const item = sourceColumn.taskIds[result.source.index];

    // 1. remove item from source column
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: [...sourceColumn.taskIds]
    };
    newSourceColumn.taskIds.splice(result.source.index, 1);

    // 2. insert into destination column
    const newDestinationColumn = {
      ...destinationColumn,
      taskIds: [...destinationColumn.taskIds]
    };
    // in line modification of items
    newDestinationColumn.taskIds.splice(result.destination.index, 0, item);

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestinationColumn.id]: newDestinationColumn
      }
    };

    setState(newState);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {state.columnOrder.map(columnId => {
        const column = state.columns[columnId];
        const tasks = column.taskIds.map(taskId => state.tasks[taskId]);
        return <Column key={column.id} column={column} tasks={tasks} />;
      })}
    </DragDropContext>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
