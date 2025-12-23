# UI Design: Login Screen

> [!NOTE]
> **Section**: Authentication  
> **Route**: `/login`

## 1. Page Requirements

### 1.1. Layout
*   **Structure**: Centered card on gradient background
*   **Background**: Indigo-to-Violet gradient (#6366F1 → #8B5CF6)
*   **Card**: White card with shadow, centered vertically

### 1.2. Login Card Components
*   **Logo**: CompetitorIQ logo at top
*   **Title**: "Welcome back"
*   **Subtitle**: "Sign in to your account"

### 1.3. Login Form
*   **Fields**:
    *   **Email**: Input with email validation
    *   **Password**: Password input with show/hide toggle
*   **Options**:
    *   **Remember Me**: Checkbox
    *   **Forgot Password**: Link (right-aligned)
*   **Submit Button**: "Sign In" (Primary, full-width)
*   **Component**: `FormElements`

### 1.4. Social Login (Optional - Low Priority)
*   **Divider**: "Or continue with"
*   **Buttons**:
    *   Google Sign-In (outline button)
    *   GitHub Sign-In (outline button)
*   **Note**: Basic email/password auth is sufficient for MVP

### 1.5. Footer
*   **Text**: "Don't have an account? Contact admin"
*   **Style**: Muted text, centered

### 1.6. States
*   **Default**: Empty form
*   **Loading**: Spinner on submit button, form disabled
*   **Error**: Red border on invalid fields, error message below
*   **Success**: Redirect to `/projects`

### 1.7. Validation
*   **Email**: Required, valid email format
*   **Password**: Required, minimum 8 characters
*   **Error Messages**:
    *   "Invalid email or password"
    *   "Email is required"
    *   "Password must be at least 8 characters"

### 1.8. Responsive
*   **Desktop**: Card max-width 400px, centered
*   **Mobile**: Card full-width with padding

