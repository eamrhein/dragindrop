const data = function() {
  return {
    tasks: {
      one: {
        id: "one",
        content: "Hello"
      },
      two: {
        id: "two",
        content: "World"
      },
      three: {
        id: "three",
        content: "My Name"
      },
      four: {
        id: "four",
        content: "is Eric"
      }
    },
    columns: {
      one: {
        id: "one",
        title: "Not Started",
        taskIds: ["one", "two", "three", "four"]
      },
      two: {
        id: "two",
        title: "In Progress",
        taskIds: []
      },
      three: {
        id: "three",
        title: "Done",
        taskIds: []
      }
    },
    columnOrder: ["one", "two", "three"]
  };
};

export default data;
