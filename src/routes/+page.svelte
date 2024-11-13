<script>
    import { onMount } from 'svelte';
    let todoName = '';
    let selectedCategory = '';
    let selectedDate = '';
    let errorMessage = '';
    let todos = [
        {
            id: 1,
            name: 'Walk The Dog',
            status: 'Incomplete',
            category: 'Personal',
            date: '2024-09-30',
            completed: false
        },
        {
            id: 2,
            name: 'Do Homework',
            status: 'Incomplete',
            category: 'School',
            date: '2024-10-01',
            completed: false
        }
    ];
    let categories = ['Personal', 'Work', 'School', 'Fitness']; // Predefined categories
    let newTodo = '';
    let newCategory = '';
    let newDate = '';
    let customCategory = '';
    let addingNewCategory = false;
    let showDropdown = false;
    let editingId = null;
    let editedTodo = { name: '', date: '' };
    let editingText = '';
    // Reactive statement for calculating remaining todos
    $: remainingTodos = todos.filter((todo) => !todo.completed).length;
    // Fetch todos from the API on mount
    onMount(async () => {
        const response = await fetch('api/todos');
        todos = await response.json();
    });

    // Fetch categories from the API on mount
    onMount(async () => {
        const response = await fetch('api/categories');
        categories = await response.json();
    });

    // Add a new todo
    async function addTodo() {
        console.log('+page addTodo');
        if (newTodo.trim() !== '' && selectedCategory.trim() !== '' && newDate.trim() !== '') {
            const response = await fetch('api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newTodo, category: selectedCategory, date: newDate })
            });
            if (response.ok) {
                const newTodoData = await response.json();
                todos = [...todos, newTodoData]; // Add the new todo to the list
                newTodo = '';
                selectedCategory = '';
                newDate = '';
                errorMessage = '';
                showDropdown = false;
            }
        } else {
            alert('Todo Name, Category, and Date must have a value.');
        }
    }

    // Add a new custom category
    async function addCategory() {
        if (customCategory.trim() !== '' && !categories.includes(customCategory)) {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: customCategory })
            });

            if (response.ok) {
                const newCategory = await response.json(); // Get the newly added category
                categories = [...categories, newCategory]; // Update categories array
                selectedCategory = newCategory; // Set new category as selected
                customCategory = ''; // Clear input field
                addingNewCategory = false; // Hide the input field
                showDropdown = false; // Close dropdown
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        }
    }

    async function deleteCategory(category) {
        if (!category) return;
        console.log('+page deletecat');
        const response = await fetch(`/api/categories?category=${encodeURIComponent(category)}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Remove the category from the list locally
            categories = categories.filter((cat) => cat !== category);
            if (selectedCategory === category) {
                selectedCategory = 'Select Category';
            }
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
        }
    }

    // Handle category selection
    function handleCategoryChange(category) {
        selectedCategory = category;
        addingNewCategory = false;
        showDropdown = false;
    }

    // Delete a todo
    async function deleteTodo(id) {
        const response = await fetch(`api/todos?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        console.log('+page deleteTodo');
        if (response.ok) {
            todos = todos.filter((todo) => todo.id !== id);
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
        }
    }

    // Start editing a todo
    function startEditing(id, name) {
        editingId = id;
        editingText = name;
    }

    async function saveEdit(id) {
        console.log('+page id', id);
        if (editingText.trim() !== '') {
            const response = await fetch(`api/todos?id=${encodeURIComponent(id)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editingText })
            });

            if (response.ok) {
                const updatedTodo = await response.json();
                todos = todos.map((todo) => (todo.id === id ? updatedTodo : todo));
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        }
        cancelEdit();
    }

    // Cancel editing
    function cancelEdit() {
        editingId = null;
        editingText = '';
    }
    // Handle keypress for editing (Enter to save, Escape to cancel)
    async function handleEditKeyPress(event, id) {
        if (event.key === 'Enter') {
            await saveEdit(id);
        } else if (event.key === 'Escape') {
            cancelEdit();
        }
    }

    async function toggleComplete(id) {
        const todo = todos.find((t) => t.id === id);
        if (!todo) {
            console.error('Todo not found');
            return;
        }

        const updatedTodo = { ...todo, completed: !todo.completed };
        console.log('id', id);

        // Use the `id` in the URL path directly
        const response = await fetch(`api/todos?id=${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTodo)
        });

        if (response.ok) {
            // Update the local `todos` state with the modified todo
            todos = todos.map((todo) => (todo.id === id ? updatedTodo : todo));
        } else {
            console.error('Failed to update todo:', await response.json());
        }
    }

    // Clear all completed todos
    //  async function clearCompletedTodos() {
    //         const response = await fetch('/api/todos?action=clear_completed', {
    //             method: 'DELETE'
    //         });

    //         if (response.ok) {
    //             console.log('Completed todos cleared');
    //             // Fetch updated todos or update the state to reflect changes
    //         } else {
    //             console.error('Failed to clear completed todos');
    //         }
    //     }
</script>

<main>
    <h1 class="text-white text-2xl p-6 text-center">Todo App</h1>

    <!-- Add Todo Section -->
    <div class="text-center mb-8 text-black">
        <input class="rounded-md" type="text" bind:value={newTodo} placeholder="Todo Name" />

        <div class="dropdown">
            <button
                class="dropdown-button mt-4 bg-blue-500 p-2 rounded-md"
                on:click={() => (showDropdown = !showDropdown)}
            >
                {selectedCategory || 'Select Category'}
            </button>
            {#if showDropdown}
                <div class="flex justify-center">
                    <ul
                        class="dropdown-menu border-spacing-5 bg-white text-blue-800 p-2 rounded-md text-left"
                    >
                        {#each categories as category}
                            <li class="categorylist">
                                <button
                                    on:click={() => deleteCategory(category)}
                                    class="bg-red-500 text-white mt-2 pl-2 pr-2 rounded text-xl">x</button
                                >
                                <span
                                    on:click={() => handleCategoryChange(category)}
                                    class="hover:text-blue-500 cursor-pointer transition-colors"
                                >
                                    {category}
                                </span>
                            </li>
                        {/each}
                        <li>
                            {#if addingNewCategory}
                                <input
                                    class="mt-2"
                                    type="text"
                                    bind:value={customCategory}
                                    placeholder="New Category"
                                    on:keypress={(e) => {
                                        if (e.key === 'Enter') addCategory();
                                    }}
                                />
                                <button on:click={addCategory} class="bg-green-500 text-white p-2 rounded"
                                    >Add</button
                                >
                            {:else}
                                <button
                                    class="bg-blue-500 rounded-md p-2 mt-2 text-white"
                                    on:click={() => (addingNewCategory = true)}>+ Add New Category</button
                                >
                            {/if}
                        </li>
                    </ul>
                </div>
            {/if}
        </div>

        <div class="text-center mt-8 text-black">
            <input class="rounded-md" type="date" bind:value={newDate} placeholder="Due Date" />
        </div>
        <div class="text-center mt-8">
            <button on:click={addTodo} class="bg-blue-500 text-white p-2 rounded">Add Todo</button>
        </div>
    </div>

    <!-- Todo List -->
    <div class="text-center">
        <ul>
            {#each todos as { id, name, status, category, date, completed }}
                <li>
                    <input type="checkbox" checked={completed} on:change={() => toggleComplete(id)} />

                    {#if editingId === id}
                        <input
                            type="text"
                            bind:value={editingText}
                            on:blur={() => saveEdit(id)}
                            on:keypress={(e) => handleEditKeyPress(e, id)}
                            autofocus
                            class="border rounded p-2 text-black"
                        />
                        <button on:click={() => saveEdit(id)} class="bg-green-500 text-white p-2 rounded"
                            >Save</button
                        >
                        <button on:click={cancelEdit} class="bg-red-500 text-white p-2 rounded">Cancel</button>
                    {:else}
                        <span
                            on:dblclick={() => startEditing(id, name)}
                            style="text-decoration: {completed ? 'line-through' : 'none'}"
                        >
                            {name} - <strong>{category}</strong> - <em>{date}</em> - Status: {status}
                        </span>
                    {/if}

                    <button on:click={() => deleteTodo(id)} class="bg-red-500 text-white p-2 rounded mt-3"
                        >Delete</button
                    >
                </li>
            {/each}
        </ul>
    </div>

    <!-- Footer Section -->
    <div class="text-center m-5">
        <footer>
            <p class="text-red-600">{remainingTodos} todos left</p>
            <!-- <button on:click={clearCompleted} class="bg-blue-500 text-white p-2 rounded">Clear completed todos</button> -->
        </footer>
    </div>
</main>
