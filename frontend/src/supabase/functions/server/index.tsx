import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase admin client
const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Create Supabase client with user token
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );
};

// Health check endpoint
app.get("/make-server-bf2eb1ba/health", (c) => {
  return c.json({ status: "ok" });
});

// Signup endpoint
app.post("/make-server-bf2eb1ba/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, fullName, role, clubId } = body;

    if (!email || !password || !fullName || !role) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const supabase = getSupabaseAdmin();

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name: fullName,
        role,
        club_id: clubId || null
      },
      // Automatically confirm the user's email since email server hasn't been configured
      email_confirm: true
    });

    if (error) {
      console.log("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    if (!data.user) {
      return c.json({ error: "Failed to create user" }, 500);
    }

    // Store additional user data in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name: fullName,
      role,
      clubId: clubId || null,
      createdAt: new Date().toISOString()
    });

    return c.json({
      user: {
        id: data.user.id,
        email,
        name: fullName,
        role,
        clubId: clubId || null
      }
    });
  } catch (err) {
    console.log("Signup error:", err);
    return c.json({ error: "Internal server error during signup" }, 500);
  }
});

// Login endpoint - returns session info
app.post("/make-server-bf2eb1ba/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: "Email and password required" }, 400);
    }

    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Login error:", error);
      return c.json({ error: error.message }, 401);
    }

    if (!data.session || !data.user) {
      return c.json({ error: "Login failed" }, 401);
    }

    // Retrieve user data from KV store
    const userData = await kv.get(`user:${data.user.id}`);

    return c.json({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at
      },
      user: userData || {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || '',
        role: data.user.user_metadata?.role || 'student',
        clubId: data.user.user_metadata?.club_id || null
      }
    });
  } catch (err) {
    console.log("Login error:", err);
    return c.json({ error: "Internal server error during login" }, 500);
  }
});

// Get current user (verify session)
app.get("/make-server-bf2eb1ba/user", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return c.json({ error: "Invalid token" }, 401);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${data.user.id}`);

    return c.json({
      user: userData || {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || '',
        role: data.user.user_metadata?.role || 'student',
        clubId: data.user.user_metadata?.club_id || null
      }
    });
  } catch (err) {
    console.log("Get user error:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Logout endpoint
app.post("/make-server-bf2eb1ba/logout", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return c.json({ error: "No token provided" }, 401);
    }

    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("Logout error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: "Logged out successfully" });
  } catch (err) {
    console.log("Logout error:", err);
    return c.json({ error: "Internal server error during logout" }, 500);
  }
});

Deno.serve(app.fetch);