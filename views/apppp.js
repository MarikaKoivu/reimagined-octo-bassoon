import { Hono } from "https://deno.land/x/hono/mod.ts";
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";
import client from "./db.js";import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

// Create the Hono app

const app = new Hono();

// Serve static files from the /static directory

app.use('/static/*', serveStatic({ root: './static' }));


import { Hono } from "https://deno.land/x/hono/mod.ts";
import { loginUser } from "./routes/login.js"; // Import login logic
import { registerUser } from "./routes/register.js"; // Import register logic
import { serveStatic } from "https://deno.land/x/hono/middleware.ts";

const app = new Hono();

app.use('*', (c, next) => {
    const contentType = c.req.headers.get('accept');
    if (contentType && contentType.includes('text/html')) {
      c.header('Content-Security-Policy', "default-src 'self'; script-src 'self' https://trusted-scripts.example.com; style-src 'self' https://trusted-styles.example.com; img-src 'self' https://trusted-images.example.com; font-src 'self' https://trusted-fonts.example.com;");
    }
    return next();
  });

// Serve static files from the /static directory
app.use('/static/*', serveStatic({ root: '.' }));

// Serve the index page
app.get('/', async (c) => {
    return c.html(await Deno.readTextFile('./views/index.html'));
});

// Serve the registration form
app.get('/register', async (c) => {
    return c.html(await Deno.readTextFile('./views/register.html'));
});

// Route for user registration (POST request)
app.post('/register', registerUser);

// Serve login page
app.get('/login', async (c) => {
    return c.html(await Deno.readTextFile('./views/login.html')); // Use the login.html file
});

// Handle user login
app.post('/login', loginUser);


Deno.serve(app.fetch);

// Run the app using the command:
// deno run --allow-net --allow-env --allow-read --watch app.js




