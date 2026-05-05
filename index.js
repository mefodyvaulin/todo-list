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

  update() {
    const oldNode = this._domNode;
    const newNode = this.render();

    if (oldNode && oldNode.parentNode) {
      oldNode.replaceWith(newNode);
    }

    this._domNode = newNode;
  }
  delete(){
    this._domNode.remove();
  }
}
class Task extends Component {
  constructor(id, name, onDelete) {
    super();
    this.id = id;
    this.name = name;
    this.onDelete = onDelete;
  }

  render() {
    return createElement("li", {}, [
      createElement("input", { type: "checkbox" }, []),
      createElement("label", {}, this.name),
      createElement("button", {}, "🗑️",
          [{name: "click", action: () => {
              this.delete()
              this.onDelete(this.id)
            } }])
    ])
  }

}

class AddTask extends Component {
  constructor(onAdd, onInput) {
    super();
    this.curState = ""
    this.onAdd = onAdd;
    this.onInput = onInput;
  }


  render(){
    return [
      createElement("input", {
        id: "new-todo",
        type: "text",
        placeholder: "Задание",
      }, [],[
          {name: "change", action: this.onInput}
      ]),
      createElement("button", {id: "add-btn"}, "+" ,[
        {name: "click", action: this.onAdd}
        ]),
    ]
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.curState = ""
    this.state = ["Сделать домашку", "Сделать практику", "Пойти домой"]
    this.state = new Map();
    this.state.set(1, "Сделать домашку")
    this.state.set(2, "Сделать практику")
    this.state.set(3, "Пойти домой")
    this.counter = 3;
  }

  onAddTask(){
    console.log("onAddTask");
    if (this.curState === "" || this.curState === null)
      return;
    this.counter += 1;
    this.state.set(this.counter, this.curState);
    this.curState = "";
    this.update();
  }

  onAddInputChange(){
    console.log("onAddInputChange");
    this.curState = document.getElementById("new-todo").value;
  }

  onDeleteById(id){
    console.log("onDeleteById");
    this.state.delete(id);
  }

  render() {
    const tasks = [];
    for (let state of this.state.entries()) {
        let id = state[0];
        let taskText = state[1];
        const task = new Task(id, taskText, (id) => this.onDeleteById(id)).getDomNode();
        tasks.push(task);
    }


    return createElement("div", {class: "todo-list"}, [
      createElement("h1", {}, "TODO List"),
      createElement("div", {class: "add-todo"}, new AddTask((() => this.onAddTask()),
          () => this.onAddInputChange()).getDomNode()),
      createElement("ul", {id: "todos"}, tasks),
    ])
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
