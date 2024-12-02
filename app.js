import { Hono } from "https://deno.land/x/hono/mod.ts";
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";
import { loginUser } from "./routes/login.js";
import { registerUser } from "./routes/register.js";

// Create the Hono app
const app = new Hono();

// Middleware to set security headers globally
app.use('*', (c, next) => {
    // Set the Content-Type header (automatically set by Hono for HTML, CSS, JS)
    c.header('Content-Type', 'text/html'); // Adjust this based on your content type (text/css, application/javascript, etc.)

    c.header(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self'; " +
        "img-src 'self'; " +
        "frame-ancestors 'none'; " +
        "form-action 'self';"
    );

    // Set X-Frame-Options header to prevent Clickjacking
    c.header('X-Frame-Options', 'DENY'); // Completely deny embedding

    // Set X-Content-Type-Options header to 'nosniff'
    c.header('X-Content-Type-Options', 'nosniff');

    return next();
});



// Serve static files from the /static directory
app.use('/static/*', serveStatic({ root: './static' }));

app.get('/', async (c) => {
    const content = await Deno.readTextFile('./views/index.html');
    return c.html(content);
});

// Serve the login page
app.get('/login', async (c) => {
    const content = await Deno.readTextFile('./views/login.html');
    return c.html(content);
});

// Handle user login
app.post('/login', loginUser);

// Serve the registration page
app.get('/register', async (c) => {
    const content = await Deno.readTextFile('./views/register.html');
    return c.html(content);
});

app.post('/register', registerUser);

//const PORT = 3000;
//app.listen({ port: PORT });
//console.log(`Server running on http://localhost:${PORT}`); 

Deno.serve(app.fetch);

// Run the app using the command:
// deno run --allow-net --allow-env --allow-read --watch app.js