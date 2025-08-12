#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const siteStatusFile = path.join(__dirname, '..', 'lib', 'site-status.ts');

function setSiteMode(isLive) {
  try {
    // Read the current file
    let content = fs.readFileSync(siteStatusFile, 'utf8');
    
    if (isLive) {
      // Switch to live mode
      content = content.replace('SITE_IS_LIVE = false', 'SITE_IS_LIVE = true');
      console.log('🚀 Switching to LIVE mode...');
      console.log('   All visitors will see the main site');
      console.log('   Coming soon page will be bypassed');
    } else {
      // Switch to coming soon mode
      content = content.replace('SITE_IS_LIVE = true', 'SITE_IS_LIVE = false');
      console.log('🔄 Switching to COMING SOON mode...');
      console.log('   Visitors will see the coming soon page');
      console.log('   Use admin code "1579" to access the main site');
    }
    
    // Write the updated content
    fs.writeFileSync(siteStatusFile, content);
    
    console.log('✅ Site mode updated successfully!');
    console.log('   Restart your dev server if running');
    
  } catch (error) {
    console.error('❌ Error updating site mode:', error.message);
    process.exit(1);
  }
}

function toggleSiteMode() {
  try {
    const content = fs.readFileSync(siteStatusFile, 'utf8');
    const isCurrentlyLive = content.includes('SITE_IS_LIVE = true');
    setSiteMode(!isCurrentlyLive);
  } catch (error) {
    console.error('❌ Error toggling site mode:', error.message);
    process.exit(1);
  }
}

function showStatus() {
  try {
    const content = fs.readFileSync(siteStatusFile, 'utf8');
    const isLive = content.includes('SITE_IS_LIVE = true');
    
    console.log('📊 Current Site Status:');
    console.log(`   Mode: ${isLive ? 'LIVE 🚀' : 'COMING SOON 🔄'}`);
    console.log(`   Admin Code: 1579`);
    
    if (!isLive) {
      console.log('   Visitors see: Coming soon page');
      console.log('   Admin access: Use code "1579"');
    } else {
      console.log('   Visitors see: Main site');
      console.log('   Coming soon: Bypassed');
    }
    
  } catch (error) {
    console.error('❌ Error reading site status:', error.message);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes('--status') || args.includes('-s')) {
  showStatus();
} else if (args.includes('--coming-soon')) {
  setSiteMode(false);
} else if (args.includes('--live')) {
  setSiteMode(true);
} else if (args.includes('--help') || args.includes('-h')) {
  console.log(`
MOT Alert Site Mode Toggle

Usage:
  npm run site:toggle          # Toggle between modes
  npm run site:status          # Show current status
  npm run site:coming-soon     # Switch to coming soon mode
  npm run site:live            # Switch to live mode

Or directly:
  node scripts/toggle-site-mode.js          # Toggle between modes
  node scripts/toggle-site-mode.js --status # Show current status
  node scripts/toggle-site-mode.js --coming-soon # Switch to coming soon
  node scripts/toggle-site-mode.js --live       # Switch to live mode

Modes:
  COMING SOON: Visitors see coming soon page, admin access with code "1579"
  LIVE: All visitors see main site, coming soon page bypassed

Admin Code: 1579
  `);
} else {
  toggleSiteMode();
}
