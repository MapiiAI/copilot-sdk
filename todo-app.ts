// todo-app.ts

// Type definitions
interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

class TodoApp {
    private todos: Todo[];

    constructor() {
        this.todos = this.loadTodos();
    }

    // Load todos from local storage
    private loadTodos(): Todo[] {
        const storedTodos = localStorage.getItem('todos');
        return storedTodos ? JSON.parse(storedTodos) : [];
    }

    // Save todos to local storage
    private saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    // Create a new todo
    public addTodo(title: string): void {
        const newTodo: Todo = {
            id: Date.now(), // Unique ID based on timestamp
            title,
            completed: false,
        };
        this.todos.push(newTodo);
        this.saveTodos();
    }

    // Read all todos
    public getTodos(): Todo[] {
        return this.todos;
    }

    // Update a todo
    public updateTodo(id: number, updatedTitle: string): void {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.title = updatedTitle;
            this.saveTodos();
        }
    }

    // Toggle completion status
    public toggleTodoCompletion(id: number): void {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
        }
    }

    // Delete a todo
    public deleteTodo(id: number): void {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
    }
}

// Usage example:
const todoApp = new TodoApp();
todoApp.addTodo('Learn TypeScript');
todoApp.addTodo('Build a todo app');
console.log(todoApp.getTodos());

todoApp.toggleTodoCompletion(1);
todoApp.updateTodo(2, 'Build a TypeScript todo app');
todoApp.deleteTodo(1);
console.log(todoApp.getTodos());
