# Code Formatting Setup Guide

Quick reference for setting up consistent code formatting in future projects.

## Files to Copy

Copy these 4 files to your project root:

1. `.prettierrc`
2. `.prettierignore`
3. `.editorconfig`
4. `.eslintrc.json`

Then add scripts to `package.json` and install dependencies.

---

## File Explanations

### `.prettierrc`
**What it does:** Defines formatting rules for Prettier  
**Key settings:**
- `useTabs: false` - Use spaces, not tabs
- `tabWidth: 2` - 2 spaces per indent level
- `singleQuote: true` - Use 'single' not "double" quotes
- `semi: true` - Add semicolons at end of statements
- `printWidth: 100` - Max line length before wrapping

### `.prettierignore`
**What it does:** Tells Prettier which files/folders to skip  
**Skips:** node_modules, dist, build, docs, screenshots, assets

### `.editorconfig`
**What it does:** Tells VS Code (and other editors) how to format as you type  
**Effect:** Auto-formats with 2 spaces when you press Tab or Enter  
**Works:** Automatically in VS Code (no extension needed)

### `.eslintrc.json`
**What it does:** Checks code quality and enforces style rules  
**Key rules:**
- `no-tabs: warn` - Warns if you use tabs instead of spaces
- `no-mixed-spaces-and-tabs: error` - Errors on mixed indentation
- `indent: warn, 2` - Warns if indentation isn't 2 spaces
- `react/prop-types: off` - Disables prop-types requirement

---

## Installation Steps

### 1. Copy config files to project root
```bash
cp .prettierrc .prettierignore .editorconfig .eslintrc.json /path/to/new/project/
```

### 2. Install dependencies
```bash
npm install -D prettier eslint eslint-plugin-react
```

### 3. Add scripts to package.json
```json
"scripts": {
  "format": "prettier --write \"src/**/*.{js,jsx,css,scss}\"",
  "format:check": "prettier --check \"src/**/*.{js,jsx,css,scss}\"",
  "lint": "eslint \"src/**/*.{js,jsx}\"",
  "lint:fix": "eslint \"src/**/*.{js,jsx}\" --fix"
}
```

### 4. Format all files
```bash
npm run format
```

---

## VS Code Settings (Optional)

For auto-format on save, add to VS Code `settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.insertSpaces": true
}
```

---

## Daily Commands

```bash
npm run format        # Fix formatting in all files
npm run format:check  # Check if files are formatted
npm run lint          # Check for code issues
npm run lint:fix      # Auto-fix linting issues
```

---

## Why This Matters

✅ **Consistent indentation** across team/projects  
✅ **No tabs vs spaces conflicts**  
✅ **Cleaner git diffs** (no whitespace noise)  
✅ **Professional code style**  
✅ **Auto-formatting** saves time
