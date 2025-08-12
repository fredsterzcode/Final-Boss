# MOT Alert - Site Protection System

## Overview
This system protects your MOT Alert website while it's under development by showing a "coming soon" page to visitors, while allowing admin access with a secret code.

## How It Works

### 1. Site Status Control
The main control is in `lib/site-status.ts`:

```typescript
export const SITE_IS_LIVE = false  // Set to true to show main site
export const ADMIN_ACCESS_CODE = '1579'  // Admin access code
export const LAUNCH_DATE = new Date('2025-01-15T00:00:00Z')  // Launch date
```

### 2. Page Flow
- **When `SITE_IS_LIVE = false`**: All visitors see the coming soon page
- **When `SITE_IS_LIVE = true`**: All visitors see the main site
- **Admin Access**: Enter code "1579" on the coming soon page to access the main site

### 3. Files Structure
- `app/page.tsx` - Main entry point (redirects based on status)
- `app/coming-soon/page.tsx` - Coming soon page with countdown
- `app/main-home-page.tsx` - Backup of original main page content
- `lib/site-status.ts` - Configuration file

## How to Use

### To Show Coming Soon Page (Current State)
```typescript
// In lib/site-status.ts
export const SITE_IS_LIVE = false
```

### To Show Main Site
```typescript
// In lib/site-status.ts
export const SITE_IS_LIVE = true
```

### To Change Admin Code
```typescript
// In lib/site-status.ts
export const ADMIN_ACCESS_CODE = 'your-new-code'
```

### To Change Launch Date
```typescript
// In lib/site-status.ts
export const LAUNCH_DATE = new Date('2025-01-20T00:00:00Z')
```

## Testing

1. **Coming Soon Page**: Visit `/coming-soon` directly
2. **Admin Access**: Click "Admin Access" button and enter "1579"
3. **Main Site**: Set `SITE_IS_LIVE = true` or use admin access

## Deployment

When you're ready to deploy:
1. Set `SITE_IS_LIVE = true` in `lib/site-status.ts`
2. Push to Git
3. Deploy to Vercel

## Security Notes

- The admin code is currently hardcoded - consider moving to environment variables for production
- The coming soon page is publicly accessible
- Consider adding rate limiting to admin access attempts

## Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

- If the coming soon page doesn't show, check `SITE_IS_LIVE` is set to `false`
- If admin access doesn't work, verify the `ADMIN_ACCESS_CODE` matches
- If countdown doesn't work, check the `LAUNCH_DATE` format
