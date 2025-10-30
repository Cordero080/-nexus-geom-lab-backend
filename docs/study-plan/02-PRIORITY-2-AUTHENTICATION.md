# Priority 2: Authentication (How Users Get In)

**Total Time: 2 hours**  
**Prerequisite: Complete Priority 1**  
**Goal: Understand signup → login → authentication flow**

After Priority 1, you understand the structure. Now learn how users actually use your app!

---

## What You'll Learn

After Priority 2, you'll understand:

- How users sign up and create accounts
- How password hashing works (security)
- What JWT tokens are and why they're needed
- How frontend and backend talk to each other
- How user data flows into AuthContext

---

## Task 2.1: Backend Auth Routes (45 minutes)

**File:** `backend/routes/auth.js`

### Context

This is where the backend handles signup and login. When a user clicks "Sign Up" or "Login" in your frontend, it sends a request here.

### Before Reading

Ask yourself: "What should happen when someone clicks 'Sign Up'?"

### While Reading

Answer these questions:

1. **What happens on signup?**

   - Find the POST /signup route
   - What validation happens?
   - What's `bcrypt.hash()`? Why hash the password?
   - What gets stored in the database?

2. **What gets returned?**

   - What data is sent back to the frontend?
   - Find where `jwt.sign()` is called
   - What's in the JWT token?

3. **What happens on login?**

   - Find the POST /login route
   - How is the password checked? (it's hashed, remember?)
   - What if password is wrong?
   - What gets returned?

4. **Error handling:**
   - What if user already exists?
   - What if password doesn't match?
   - How are errors returned to frontend?

### Key Code Patterns

```javascript
// Password hashing on signup - protects password if database is hacked
const hashedPassword = await bcrypt.hash(password, 10);

// Password verification on login - checks if typed password matches hashed password
const passwordMatch = await bcrypt.compare(password, user.password);

// JWT token creation - sends user data encrypted to frontend
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
```

### After Reading

Complete this checklist:

- [ ] Understand what bcrypt does (hashes passwords)
- [ ] Understand what JWT does (encrypts user info)
- [ ] Can trace the signup flow
- [ ] Can trace the login flow
- [ ] Know what gets sent back to frontend

### Key Insight

Backend doesn't store plain passwords! It stores hashed versions. This protects users if your database is hacked.

---

## Task 2.2: User Database Schema (20 minutes)

**File:** `backend/models/User.js`

### Context

This defines what data gets stored for each user. Like a template for every user in your database.

### Before Reading

Ask yourself: "What information about a user do I need to store?"

### While Reading

Answer these questions:

1. **What fields does User have?**

   - Look at the schema
   - List all fields (username, email, password, etc.)
   - What's each field for?

2. **What's `unlockedNoetechs`?**

   - This tracks which features the user has unlocked
   - Why would you need this?

3. **What's the relationship to Scenes?**

   - Find the Scenes reference
   - What does this mean for how data is organized?

4. **Timestamps:**
   - Find `createdAt` and `updatedAt`
   - Why are these useful?

### After Reading

Complete this checklist:

- [ ] Can list all User fields
- [ ] Understand what `unlockedNoetechs` does
- [ ] Know how Users relate to Scenes
- [ ] Understand timestamps

### Key Insight

The User schema is like a "blueprint" for storing user data. Every user that signs up gets these fields.

---

## Task 2.3: Frontend API Calls (35 minutes)

**File:** `src/services/sceneApi.jsx`

### Context

This is the "bridge" between frontend and backend. When your React app needs to talk to the server, it uses these functions.

### Before Reading

Ask yourself: "How does my React app send data to the Node.js backend?"

### While Reading

Answer these questions:

1. **What's the backend URL?**

   - Find where `API_URL` or `localhost` is used
   - What port does backend run on?

2. **How is the JWT token sent?**

   - Find the `Authorization` header
   - Look for `Bearer` token pattern
   - Why is this in a header instead of the body?

3. **Signup function:**

   - Find the signup() function
   - What data does it send?
   - What does it expect back?
   - What happens if signup fails?

4. **Login function:**

   - Find the login() function
   - What data does it send?
   - What does it expect back?
   - How is the token handled?

5. **Other API functions:**
   - Scan for other functions (you'll study these in Priority 4)
   - Just get a sense of what's available

### Key Code Pattern

```javascript
// This is how you send a POST request with authentication
fetch(`${API_URL}/scenes`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // ← Token sent in header
  },
  body: JSON.stringify(data),
});
```

### After Reading

Complete this checklist:

- [ ] Know where the backend URL is
- [ ] Understand how JWT is sent to backend
- [ ] Can find signup/login functions
- [ ] Understand fetch() request format
- [ ] Know how errors are handled

### Key Insight

The `Authorization` header with `Bearer` token is how frontend proves it's a real user to the backend.

---

## Complete Auth Flow (End-to-End)

Now trace the complete flow. This is how your app works:

### User signs up:

1. User types email/password in frontend
2. Clicks "Sign Up"
3. `sceneApi.signup()` is called with email/password
4. Frontend sends POST to `/api/auth/signup`
5. Backend `auth.js` receives it
6. Hashes password with bcrypt
7. Saves user to database (User.js)
8. Creates JWT token
9. Sends token + user data back to frontend
10. Frontend receives in AuthContext
11. `setUser()` and `setToken()` update state
12. Data saved to localStorage
13. User is now logged in!

### User logs in (later):

1. User types email/password
2. Clicks "Login"
3. `sceneApi.login()` is called
4. Frontend sends POST to `/api/auth/login`
5. Backend finds user by email
6. Uses bcrypt to check if password matches
7. If match: creates JWT token, sends back
8. Frontend receives, updates AuthContext
9. User is logged in!

### User performs action (e.g., save scene):

1. User clicks "Save Scene"
2. Code calls API endpoint with token in Authorization header
3. Backend receives request
4. Checks Authorization header for valid JWT
5. If valid, allows the action
6. If invalid/expired, rejects the request

---

## Self-Check: Are You Ready for Priority 3?

Answer these questions:

### Question 1: Password Security

"Why doesn't the backend store plain passwords?"  
Your answer: ********\_\_\_********

**Good answer:** "Because if the database gets hacked, hackers get passwords. Hashing protects them."

### Question 2: JWT Token

"What is a JWT token used for?"  
Your answer: ********\_\_\_********

**Good answer:** "It's an encrypted package containing user info (like userId). It proves the frontend is a real user."

### Question 3: Signup Flow

"Walk me through what happens when someone clicks 'Sign Up'"  
Your answer: ********\_\_\_********

**Good answer:** "Frontend sends email/password → Backend hashes password → Saves to database → Creates JWT → Sends back to frontend → Frontend stores in localStorage"

### Question 4: Auth Header

"What's the Authorization header and why is it needed?"  
Your answer: ********\_\_\_********

**Good answer:** "It's how the frontend sends the JWT token with every request. It proves the user is authenticated."

### Question 5: API Call

"Where in the code would I look to see how login works?"  
Your answer: ********\_\_\_********

**Good answer:** "sceneApi.jsx for the frontend call, and backend/routes/auth.js for the server logic"

---

## Tips for Success

### 1. Don't Get Lost in Details

You don't need to understand every line of code. Just the general flow.

### 2. Security Concepts

- **Hashing:** Converting password to gibberish that can't be reversed
- **JWT:** Encrypted token that proves you're logged in
- **Authorization header:** How you send the token to the backend

### 3. Compare Files

Open all 3 files (sceneApi.jsx, auth.js, User.js) in different tabs. See how they connect.

### 4. Ask Why

- Why hash passwords? (Security)
- Why JWT tokens? (Stateless authentication)
- Why Authorization header? (Secure way to send token)

---

## Common Struggles

### Struggle: "I don't understand bcrypt"

**Solution:** Just know: bcrypt converts passwords to gibberish that can't be reversed. That's it.

### Struggle: "JWT seems complicated"

**Solution:** Just know: JWT is an encrypted message from backend saying "this user is real". Frontend uses it to prove it's that user.

### Struggle: "Why 3 different files?"

**Solution:** Separation of concerns:

- sceneApi.jsx = frontend communication
- auth.js = backend logic
- User.js = database structure

---

## You're Done with Priority 2 When

- ✅ You finished all 3 tasks
- ✅ You answered all 5 self-check questions correctly
- ✅ You can trace signup and login flows
- ✅ You understand JWT and password hashing basics

---

## Next Steps

Once you're confident with Priority 2:

1. Take a 1-hour break
2. Open `02-PRIORITY-3-3D-RENDERING.md`
3. Get ready to understand how 3D scenes work

**Congratulations! You understand authentication! 🔐**
