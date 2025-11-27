# Deployment Guide

## Files Overview

- `index.html` - Main calculator (unprotected)
- `index-protected.html` - Password-protected version
- `PASSWORD-PROTECTION.md` - Password protection documentation

## Deploy to GitHub Pages

### Option 1: Public Access (No Password)

Deploy the unprotected version:

```bash
git add index.html
git commit -m "Deploy calculator"
git push
```

Enable GitHub Pages in repository settings → Pages → Source: main branch

Access at: `https://yourusername.github.io/repository-name/`

### Option 2: Password Protected

Deploy the protected version as the main page:

```bash
# Generate protected version
npm run protect

# Replace main file
cp index-protected.html index.html

# Deploy
git add index.html
git commit -m "Deploy password-protected calculator"
git push
```

**Password:** `workshop2024`

### Option 3: Both Versions

Keep both versions available:

```bash
# Generate protected version
npm run protect

# Commit both
git add index.html index-protected.html
git commit -m "Deploy both versions"
git push
```

Access:
- Public: `https://yourusername.github.io/repository-name/`
- Protected: `https://yourusername.github.io/repository-name/index-protected.html`

## Testing Before Deployment

1. Generate protected version:
   ```bash
   npm run protect
   ```

2. Open `index-protected.html` in browser

3. Enter password: `workshop2024`

4. Verify calculator loads and works correctly

5. Test all features:
   - Sliders (price, enrollment)
   - Cost management (add/edit/remove)
   - Scenario management (save/load/delete/compare)
   - Charts update correctly

## Changing the Password

Edit `package.json` and change the password in the `protect` script:

```json
"protect": "npx staticrypt index.html -p YOUR_NEW_PASSWORD --short ..."
```

Then regenerate:
```bash
npm run protect
```

## Current Configuration

- **Password:** `workshop2024`
- **Encryption:** AES-256 via StaticCrypt
- **Theme Colors:** Amber (#f59e0b) and Dark (#18181b)
- **Title:** "Workshop Financial Calculator"
