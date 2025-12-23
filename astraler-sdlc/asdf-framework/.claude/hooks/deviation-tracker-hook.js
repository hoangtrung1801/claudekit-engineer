#!/usr/bin/env node

/**
 * ASDF Deviation Tracker Hook
 *
 * Post-tool hook that tracks file modifications for potential reverse sync.
 * Logs changes that may need to be reflected in specifications.
 */

const fs = require('fs');
const path = require('path');

// Get hook input from environment
const toolName = process.env.CLAUDE_TOOL_NAME || '';
const filePath = process.env.CLAUDE_FILE_PATH || '';
const success = process.env.CLAUDE_TOOL_SUCCESS === 'true';

// Paths
const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const asdfDocsPath = path.join(projectDir, 'asdf-docs');
const changelogDir = path.join(asdfDocsPath, 'operations', 'changelog');
const deviationLogPath = path.join(changelogDir, 'pending-deviations.md');

/**
 * Get current date in YYMMDD format
 */
function getDateStamp() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

/**
 * Check if this is a source code modification
 */
function isSourceCodeWrite(filePath) {
  if (!filePath) return false;

  const docsPaths = ['asdf-docs', '.claude', 'docs', 'plans', 'node_modules', '.git'];
  return !docsPaths.some(p => filePath.includes(p));
}

/**
 * Log deviation for potential reverse sync
 */
function logDeviation(filePath) {
  // Ensure changelog directory exists
  if (!fs.existsSync(changelogDir)) {
    fs.mkdirSync(changelogDir, { recursive: true });
  }

  const timestamp = getDateStamp();
  const relativePath = path.relative(projectDir, filePath);

  let existingContent = '';
  if (fs.existsSync(deviationLogPath)) {
    existingContent = fs.readFileSync(deviationLogPath, 'utf8');
  }

  // Check if file already logged today
  if (existingContent.includes(relativePath) && existingContent.includes(timestamp)) {
    return; // Already logged
  }

  const logEntry = `- [${timestamp}] Modified: \`${relativePath}\`\n`;

  if (!existingContent) {
    // Create new file
    const header = `# Pending Deviations

Files modified that may need reverse sync review.

## Modifications

`;
    fs.writeFileSync(deviationLogPath, header + logEntry);
  } else {
    // Append to existing
    fs.appendFileSync(deviationLogPath, logEntry);
  }

  console.log(`[ASDF] Tracked modification: ${relativePath}`);
}

/**
 * Main tracking logic
 */
function track() {
  // Only track successful Write/Edit operations
  if (!success || !['Write', 'Edit'].includes(toolName)) {
    process.exit(0);
  }

  // Only track source code modifications
  if (!isSourceCodeWrite(filePath)) {
    process.exit(0);
  }

  // Check if ASDF is initialized
  if (!fs.existsSync(asdfDocsPath)) {
    process.exit(0);
  }

  // Log the deviation
  logDeviation(filePath);

  process.exit(0);
}

track();
