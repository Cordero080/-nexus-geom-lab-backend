# Priority 0: Debugging Tools (DO FIRST!)

**Total Time: 45 minutes**  
**Goal: Essential tools for understanding and debugging your AI-generated code**

⚠️ **CRITICAL:** Do this BEFORE studying any code. These tools will make everything else 10x easier.

---

## Why This Priority Exists

When you use AI to generate code, you need to be able to:

- **Inspect what was actually created** (React DevTools)
- **See why styles aren't working** (Browser DevTools)
- **Debug when things break** (Console)
- **Understand what changed** (Git)

Without these tools, you're flying blind through your own codebase.

---

## Task 0.1: React DevTools Setup (15 minutes)

### Install React DevTools Extension

1. **Chrome/Edge:** Go to Chrome Web Store → Search "React Developer Tools"
2. **Firefox:** Go to Firefox Add-ons → Search "React Developer Tools"
3. **Install and restart browser**

### Practice on Your App

1. **Open your app** (npm run dev)
2. **Press F12** → Go to "Components" tab
3. **Click on different components** in the tree
4. **Look at Props and State** in the right panel

### Key Skills to Practice

- **Find a component** by clicking on it in the browser
- **See what props it receives**
- **See what state it manages**
- **Trace prop flow** from parent to child

**✅ You're ready when:** You can find your HomePage component and see its portalState values.

---

## Task 0.2: Browser DevTools CSS Inspection (15 minutes)

### Open DevTools

1. **Right-click any element** → "Inspect"
2. **Or press F12** → Go to "Elements" tab

### Practice CSS Debugging

**Try this on your navbar:**

1. **Right-click your navbar** → Inspect
2. **Look at the Styles panel** on the right
3. **See which CSS rules are applied**
4. **See which rules are crossed out** (overridden)
5. **Try editing a CSS value** live

### Key Skills to Practice

- **Find the actual CSS affecting an element**
- **See which styles are being overridden**
- **Edit CSS live to test changes**
- **Understand the cascade** (which rules win)

**✅ You're ready when:** You can inspect your navbar and see the `rgba(0,0,0,0.65)` background rule.

---

## Task 0.3: Console Debugging (10 minutes)

### Open Console

1. **Press F12** → Go to "Console" tab
2. **Or right-click** → Inspect → Console

### Practice Console Commands

**Try these in your app's console:**

```javascript
// See portal state colors
console.log(
  document.documentElement.style.getPropertyValue("--portal-color-0")
);

// Find all navbars
console.log(document.querySelectorAll(".quantum-nav"));

// Check if you're on geom-lab page
console.log(document.body.classList.contains("geom-lab-page"));
```

### Key Skills to Practice

- **Reading error messages** (red text)
- **Using console.log** to inspect variables
- **Running JavaScript** in the console
- **Understanding stack traces**

**✅ You're ready when:** You can run a console.log command and see the output.

---

## Task 0.4: Git Basics for AI Development (5 minutes)

### Essential Git Commands

**In your terminal:**

```bash
# See what changed
git status

# See your recent work
git log --oneline -10

# See what you changed in a file
git diff src/HomePage/HomePage.jsx

# Go back to a previous state (if needed)
git reset --hard [commit-hash]
```

### Key Skills to Practice

- **See what files you've modified**
- **See your commit history**
- **Understand what changed** between versions
- **Go back if something breaks**

**✅ You're ready when:** You can run `git status` and understand the output.

---

## Why These Tools Matter for AI-Assisted Development

### **React DevTools**

- **See what AI actually created** in component structure
- **Debug prop passing issues** when components don't work
- **Understand state flow** in complex apps

### **Browser DevTools**

- **See why AI-generated CSS isn't working** (specificity, overrides)
- **Test style changes** before asking AI to implement them
- **Debug responsive design** and animations

### **Console**

- **Debug AI-generated JavaScript** when it has errors
- **Test code snippets** before implementing them
- **Understand error messages** when things break

### **Git**

- **Track AI-generated changes** to see what was modified
- **Roll back problematic AI code** safely
- **Understand the evolution** of your codebase

---

## Red Flags Without These Tools

❌ **"The AI code doesn't work but I don't know why"**  
✅ **With tools:** Inspect element, see exact CSS applied, understand the issue

❌ **"Props aren't passing correctly"**  
✅ **With tools:** React DevTools shows exactly what props each component receives

❌ **"Something broke after the AI changes"**  
✅ **With tools:** Git diff shows exactly what changed, can roll back specific changes

❌ **"Console shows errors but I don't understand them"**  
✅ **With tools:** Can read stack traces and understand which file/line has the issue

---

## Success Criteria

After 45 minutes, you should be able to:

1. **Find any component** in React DevTools and see its props/state
2. **Inspect any CSS rule** and understand why it's applied or overridden
3. **Read console errors** and understand which file they point to
4. **Use git status/diff** to see what changed in your code

---

## Next Step

🚀 **Now you're ready for Priority 1: Foundation**

With these debugging tools, studying your codebase will be:

- **Faster** (see things directly instead of guessing)
- **More accurate** (verify what's actually happening)
- **Less frustrating** (understand issues instead of being confused)

**Time investment:** 45 minutes  
**Time savings:** Hours of confusion avoided

---

## Quick Reference

**React DevTools:** F12 → Components tab  
**CSS Inspection:** Right-click → Inspect → Styles panel  
**Console:** F12 → Console tab  
**Git Status:** `git status` in terminal

**You're now equipped to understand your AI-generated codebase!** 🛠️
