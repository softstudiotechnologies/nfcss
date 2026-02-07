---
description: How to add a new client to the NFC Portfolio template
---

This workflow explains how to use this repository as a template to generate new NFC portfolios for different clients.

### 1. Prepare Client Assets
Add the client's images to the `public/` folder:
- **Profile Image**: (e.g., `client_avatar.jpg`)
- **Cover Image**: (e.g., `client_banner.jpg`)

### 2. Configure Client Data
Open `src/config.js` and follow these steps:

1. **Create a New Client Object**:
   Copy one of the existing examples (like `client_printo`) and rename it (e.g., `client_new_business`).
2. **Customize the Details**:
   - `profile`: Set name, role, bio, and image paths.
   - `theme`: Set `primaryColor` (brand color) and `surfaceColor` (background).
   - `skills`: List their key services or expertise.
   - `projects`: Add featured work or products with images and links.
   - `actions`: Configure contact buttons (Email, Phone, WhatsApp).
   - `socials`: Define their social media presence.

### 3. Activate the Client
At the very bottom of `src/config.js`, update the export line to point to your new object:

```javascript
// Change this line to your new client object name
export const config = client_new_business;
```

### 4. Deploy
Run your build command and deploy to your preferred hosting (Vercel, Netlify, etc.). Each client can have their own branch or a separate repository if needed.

### 5. Automated Switching (Advanced)
If you want to host multiple clients on one site, you can enhance `config.js` to detect the `window.location.hostname` or a URL query parameter (e.g., `?client=printo`) to switch the `config` object dynamically.
