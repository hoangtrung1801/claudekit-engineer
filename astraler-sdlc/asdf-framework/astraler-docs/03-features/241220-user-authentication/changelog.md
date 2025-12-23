# Changelog: User Authentication

## [241222] - Reverse Sync

### Changed
- Token strategy section updated to reflect Supabase SDK usage
- Original custom JWT plan replaced with built-in handling

### Reason
Supabase SDK handles token refresh automatically, reducing complexity and potential security issues.

### By
Coder AI (automated)

---

## [241222] - Email Verification Added

### Added
- FR-006: Email verification on registration
- Resend integration for email delivery
- Verification email template

### Changed
- Registration flow now requires email verification

### By
Coder AI

---

## [241221] - Core Implementation Complete

### Added
- Login/Register forms and API routes
- Password reset flow
- Session management

### By
Coder AI

---

## [241220] - Spec Created

### Added
- Initial specification
- Requirements definition
- UI/UX wireframes

### By
Product Architect
