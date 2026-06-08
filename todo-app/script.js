// To-Do List Application with Local Storage

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.storageKey = 'todoList';
        
        // DOM Elements
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.deleteAllBtn = document.getElementById('deleteAll');
        this.totalCount = document.getElementById('totalCount');
        this.activeCount = document.getElementById('activeCount');
        this.completedCount = document.getElementById('completedCount');
        
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Add task
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        // Clear and delete buttons
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        this.deleteAllBtn.addEventListener('click', () => this.deleteAll());
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        
        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.todos.unshift(todo);
        this.todoInput.value = '';
        this.todoInput.focus();
        
        this.saveToStorage();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveToStorage();
        this.render();
    }

    clearCompleted() {
        if (this.todos.filter(t => t.completed).length === 0) {
            alert('No completed tasks to clear!');
            return;
        }

        if (confirm('Are you sure you want to clear all completed tasks?')) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveToStorage();
            this.render();
        }
    }

    deleteAll() {
        if (this.todos.length === 0) {
            alert('No tasks to delete!');
            return;
        }

        if (confirm('Are you sure you want to delete all tasks? This cannot be undone!')) {
            this.todos = [];
            this.saveToStorage();
            this.render();
        }
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const active = total - completed;

        this.totalCount.textContent = total;
        this.activeCount.textContent = active;
        this.completedCount.textContent = completed;
    }

    render() {
        this.updateStats();
        
        const filteredTodos = this.getFilteredTodos();
        this.todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            this.renderEmptyState();
            return;
        }

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    aria-label="Mark task as ${todo.completed ? 'incomplete' : 'complete'}"
                >
                <span class="todo-text" title="${todo.text}">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn" aria-label="Delete task">Delete</button>
            `;

            // Checkbox toggle
            const checkbox = li.querySelector('.checkbox');
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

            // Delete button
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

            this.todoList.appendChild(li);
        });
    }

    renderEmptyState() {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        
        let message = '';
        if (this.currentFilter === 'active') {
            message = 'No active tasks! Great job! 🎉';
        } else if (this.currentFilter === 'completed') {
            message = 'No completed tasks yet. Start completing some! 💪';
        } else {
            message = 'No tasks yet. Add one to get started! ✨';
        }

        emptyDiv.innerHTML = `
            <div class="empty-state-icon">📝</div>
            <div class="empty-state-text">${message}</div>
            <div class="empty-state-subtext">Add a new task using the input above</div>
        `;
        
        this.todoList.appendChild(emptyDiv);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                this.todos = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            this.todos = [];
        }
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
