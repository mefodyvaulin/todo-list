function createElement(tag, attributes, children, callbacks = []) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  for (const callbackObj of callbacks) {
    element.addEventListener(callbackObj.name, callbackObj.action)
  }

  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.curState = ""
    this.state = ["Сделать домашку", "Сделать практику", "Пойти домой"]
  }

  onAddTask(){
    if (this.state === "" || this.state === null)
      return;
    this.state.append(this.curState);
    this.curState = "";
  }

  onAddInputChange(){
    this.curState = document.getElementById("new-todo").value;
  }

  render() {
    const tasks = [];
    for (let state of this.state) {
        const task = createElement("li", {}, [
          createElement("input", { type: "checkbox" }),
          createElement("label", {}, state),
          createElement("button", {}, "🗑️")
        ])
        tasks.push(task);
    }

    return createElement("div", {class: "todo-list"}, [
      createElement("h1", {}, "TODO List"),
      createElement("div", {class: "add-todo"}, [
        createElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
        },
            [
                {name: "change", action: this.onAddInputChange}
            ]),
        createElement("button", {id: "add-btn"}, "+", [
            {name: "onClick", action: this.onAddTask}
        ]),
      ]),
      createElement("ul", {id: "todos"}, tasks),
    ])
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
