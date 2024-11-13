import { GET_TODOS, POST_TODO, PUT_TODO, DELETE_TODO, CLEAR_COMPLETED } from '../server.js';
export async function GET() {
    return GET_TODOS();
}

export async function POST({ request }) {
    return POST_TODO({ request });
}


export async function PUT({ request, url }) {
    console.log("+server PUT todo");

    // Extract `id` from the URL search parameters
    const id = url.searchParams.get('id');
    if (!id) {
        return new Response(JSON.stringify({ error: 'Todo ID is required for update.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Extract the data from the request body
    const data = await request.json();
    const { name, completed } = data;

    console.log("id", id);
    console.log("updatedData", { name, completed });

    // Pass the `id` and updated data to the PUT_TODO function
    return PUT_TODO(id, { name, completed });
}


export async function DELETE({ request }) {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
console.log("+server DELETE")
    if (action === 'clear_completed') {
        return CLEAR_COMPLETED();
    }

    const id = url.searchParams.get('id');
    if (!id) {
        return new Response(JSON.stringify({ error: 'Todo ID is required for deletion.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return DELETE_TODO(id);
}