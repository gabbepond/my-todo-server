//import { json } from '@sveltejs/kit';
import { GET_CATEGORIES, POST_CATEGORY, DELETE_CATEGORY } from '../server.js';

export async function GET() {
    return GET_CATEGORIES();
}

export async function POST({ request }) {
    return POST_CATEGORY({ request });
}

// Define the DELETE function in +server.js
export async function DELETE({ request }) {
    console.log("+server delete cat:");
    const url = new URL(request.url);
    const category = url.searchParams.get('category'); // Extract category from query
    
    if (!category) {
        return new Response(JSON.stringify({ error: 'Category is required.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Pass the category directly to DELETE_CATEGORY
    return DELETE_CATEGORY(category);
}