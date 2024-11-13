import { json } from '@sveltejs/kit';


export const todos = [];
// let todos = [
//     { id: 1, name: 'Walk The Dog', status: 'Incomplete', category: 'Personal', date: '2024-09-30', completed: false },
//     { id: 2, name: 'Do Homework', status: 'Incomplete', category: 'School', date: '2024-10-01', completed: false },
// ];

let categories = ['Personal', 'Work', 'School', 'Fitness'];

// GET all todos
export async function GET_TODOS() {
    return json(todos);
}

// POST a new todo
export async function POST_TODO({ request }) {
    const { name, category, date } = await request.json();
    const newTodo = {
        id: Date.now(),
        name,
        status: 'Incomplete',
        category,
        date,
        completed: false
    };
    todos.push(newTodo);
    return json(newTodo, { status: 201 });
}

// PUT_TODO
export async function PUT_TODO(id, updatedData) {
    console.log("server PUT_TODO");
    const todo = todos.find(todo => todo.id === Number(id)); // Find the todo by its id

    if (!todo) return new Response(JSON.stringify({ error: 'Todo not found' }), { status: 404 });

    // Update the todo fields
    if (updatedData.name) todo.name = updatedData.name;
    if (updatedData.completed !== undefined) {
        todo.completed = updatedData.completed;
        todo.status = updatedData.completed ? 'Complete' : 'Incomplete';
    }

    return new Response(JSON.stringify(todo), { status: 200 }); // Return the updated todo
}


// DELETE a specific todo
export async function DELETE_TODO(id) {
    const todoId = Number(id);

    // Check if the todo exists
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    if (todoIndex === -1) {
        return json({ error: 'Todo not found' }, { status: 404 });
    }

    // Remove the todo from the list
    todos.splice(todoIndex, 1);
    
    // Return a 204 status with no content
    return new Response(null, { status: 204 });
}

// GET all categories
export async function GET_CATEGORIES() {
    return json(categories);
}

// POST a new category
export async function POST_CATEGORY({ request }) {
    const { name } = await request.json(); // Extract "name" to match what the client sends

    console.log("server Adding category:", name);
    
    if (!categories.includes(name)) {
        categories.push(name);
        return json(name, { status: 201 }); // Return the new category name directly
    }
    return json({ error: 'Category already exists' }, { status: 409 });
}


// DELETE a specific category
export async function DELETE_CATEGORY(category) {
    console.log("server DELETE_CAT");
    if (!category) {
        console.log("Error: Category is required.");
        return json({ error: 'Category is required.' }, { status: 400 });
    }

    // Check if the category is in use
    const inUse = todos.some(todo => todo.category === category);
    if (inUse) {
        console.log(`Error: Category "${category}" is in use.`);
        return json({ error: `Category "${category}" is in use and cannot be deleted.` }, { status: 409 });
    }

    // Remove the category
    const originalLength = categories.length;
    categories = categories.filter(cat => cat !== category);

    if (categories.length === originalLength) {
        console.log(`Error: Category "${category}" not found.`);
        return json({ error: `Category "${category}" not found.` }, { status: 404 });
    }

    console.log(`Category "${category}" deleted successfully.`);
    return json({ message: 'Category deleted' }, { status: 200 });
}


export async function CLEAR_COMPLETED() {
    console.log("server CLEAR_COMPLETED")
    todos = todos.filter(todo => !todo.completed);
    return json({ message: 'Completed todos cleared' }, { status: 200 });
}
