import { Hono } from "https://deno.land/x/hono/mod.ts";
import { registerUser} from "./routes/register.js"; // Import register logic

const app = new Hono();

app.get('/register', async (c) => {
    return c.html(await Deno.readTextFile('./views/register.html'));});

    app.post('/register', registerUser);
    
    Deno.serve(app.fetch);

    // Run the app using the command: deno run --allow-net --allow-env --allow-read --watch app.js
