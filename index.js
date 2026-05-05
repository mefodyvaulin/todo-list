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
    this._domNode =  this.render();
    document
  }
}
class Task extends Component {
  constructor(name) {
    super();
    this.name = name;
  }

  render() {
    return createElement("li", {}, [
      createElement("input", { type: "checkbox" }, [], [
          {name: "change", action: this.onCompleteTask}
      ]),
      createElement("label", {}, this.name),
      createElement("button", {}, "🗑️")
    ])
  }

  onCompleteTask(){
    if (this.checked)
      this.nextElementSibling.style.color = "gray";
    else{
      this.nextElementSibling.style.color = "black";
    }
  }

}

class AddTask extends Component {
  constructor(state) {

    super();
    this.curState = ""
    this.id = ""
    this.state = state;
  }
  onAddTask(){
    console.log("onAddTask");
    if (this.curState === "" || this.curState === null)
      return;
    this.state.push(this.curState);
    this.curState = "";
    this.update();
  }

  onAddInputChange(){
    console.log("onAddInputChange");
    this.curState = document.getElementById("new-todo").value;
  }

  render(){
    return [
      createElement("input", {
        id: "new-todo",
        type: "text",
        placeholder: "Задание",
      }, [],[
          {name: "change", action: () => {this.onAddInputChange ()}}
      ]),
      createElement("button", {id: "add-btn"}, "+" ,[
        {name: "click", action: () => {
            this.onAddTask()
          }}
        ]),
    ]
  }
}

class TodoList extends Component {
  constructor() {
    super();

    this.state = ["Сделать домашку", "Сделать практику", "Пойти домой"]
  }

  render() {
    const tasks = [];
    for (let state of this.state) {
        const task = new Task(state).getDomNode();
        tasks.push(task);
    }

    return createElement("div", {class: "todo-list"}, [
      createElement("h1", {}, "TODO List"),
      createElement("div", {class: "add-todo"}, new AddTask(this.state).getDomNode()),
      createElement("ul", {id: "todos"}, tasks),
    ])
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
