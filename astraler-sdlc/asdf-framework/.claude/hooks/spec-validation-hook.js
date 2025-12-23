#!/usr/bin/env node

/**
 * ASDF Spec Validation Hook
 *
 * Pre-tool hook that validates spec context is loaded before implementation.
 * Warns if attempting to write code without proper context loading.
 */

const fs = require('fs');
const path = require('path');

// Get hook input from environment
const toolName = process.env.CLAUDE_TOOL_NAME || '';
const filePath = process.env.CLAUDE_FILE_PATH || '';

// Paths to check for context loading indicators
const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const asdfDocsPath = path.join(projectDir, 'asdf-docs');
const sessionHandoffPath = path.join(asdfDocsPath, 'operations', 'session-handoff.md');
const implementationActivePath = path.join(asdfDocsPath, 'operations', 'implementation-active.md');

/**
 * Check if ASDF structure exists
 */
function asdfStructureExists() {
  return fs.existsSync(asdfDocsPath);
}

/**
 * Check if writing to source code (not docs/config)
 */
function isSourceCodeWrite(filePath) {
  if (!filePath) return false;

  const docsPaths = ['asdf-docs', '.claude', 'docs', 'plans', '.md', '.json'];
  return !docsPaths.some(p => filePath.includes(p));
}

/**
 * Check if implementation is active
 */
function hasActiveImplementation() {
  if (!fs.existsSync(implementationActivePath)) return false;

  const content = fs.readFileSync(implementationActivePath, 'utf8');
  return content.includes('Current Task') && !content.includes('[None');
}

/**
 * Main validation
 */
function validate() {
  // Only validate for Write/Edit tools
  if (!['Write', 'Edit'].includes(toolName)) {
    process.exit(0);
  }

  // Only validate for source code writes
  if (!isSourceCodeWrite(filePath)) {
    process.exit(0);
  }

  // Check if ASDF structure exists
  if (!asdfStructureExists()) {
    // ASDF not initialized - just warn, don't block
    console.log('[ASDF] Warning: asdf-docs/ not found. Consider running /asdf:init');
    process.exit(0);
  }

  // Check if there's an active implementation
  if (!hasActiveImplementation()) {
    console.log('[ASDF] Warning: No active implementation task found.');
    console.log('[ASDF] Consider using /asdf:implement [spec-path] to track your work.');
  }

  process.exit(0);
}

validate();
