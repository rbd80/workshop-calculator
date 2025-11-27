# Password Protection

This project uses [StaticCrypt](https://github.com/robinmoisson/staticrypt) to add password protection to the Workshop Financial Calculator.

## Quick Start

### Generate Protected Version

```bash
npm run protect
```

This creates `index-protected.html` with password protection.

**Default Password:** `workshop2024`

### Test Locally

1. Open `index-protected.html` in your browser
2. Enter password: `workshop2024`
3. The calculator should load

### Deploy to GitHub Pages

Option 1: Replace the main file
```bash
cp index-protected.html index.html
git add index.html
git commit -m "Add password protection"
git push
```

Option 2: Deploy protected version separately
```bash
git add index-protected.html
git commit -m "Add protected version"
git push
# Access at: https://yourusername.github.io/repo/index-protected.html
```

## Custom Password

To use a different password:

```bash
npx staticrypt index.html -p YourPassword --short \
  --template-title "Workshop Financial Calculator" \
  --template-instructions "Enter password to access the calculator" \
  --template-color-primary "#f59e0b" \
  --template-color-secondary "#18181b"

mv encrypted/index.html index-protected.html
rmdir encrypted
```

## Customization

You can customize the password prompt appearance:

- `--template-title`: Page title
- `--template-instructions`: Instructions shown to users
- `--template-color-primary`: Button color (default: amber #f59e0b)
- `--template-color-secondary`: Background color (default: dark #18181b)
- `--template-button`: Button text (default: "DECRYPT")
- `--template-placeholder`: Password field placeholder

Example:
```bash
npx staticrypt index.html -p MyPassword --short \
  --template-title "Private Calculator" \
  --template-button "UNLOCK" \
  --template-placeholder "Enter Access Code"
```

## Security Notes

- StaticCrypt uses AES-256 encryption
- Content is encrypted and cannot be viewed without the password
- Password is never transmitted to a server
- "Remember me" feature stores encrypted password in localStorage
- Suitable for protecting content from casual viewing
- Not suitable for highly sensitive data requiring compliance

## Files

- `index.html` - Original unprotected calculator
- `index-protected.html` - Password-protected version (generated)
- `.staticrypt.json` - StaticCrypt configuration (if generated)

## More Information

See [StaticCrypt documentation](https://github.com/robinmoisson/staticrypt) for advanced options.
