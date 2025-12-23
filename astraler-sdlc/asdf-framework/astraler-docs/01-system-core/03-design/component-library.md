# Component Library

> **Version**: 1.0.0
> **Last Updated**: 241223
> **Owner**: Design System Lead

---

## 1. Overview

Detailed component specifications extending the design system. Each component includes props, variants, accessibility requirements, and usage guidelines.

---

## 2. Component Index

| Category | Components |
|----------|------------|
| **Actions** | Button, IconButton, Link, FAB |
| **Inputs** | TextField, Select, Checkbox, Radio, Switch, DatePicker |
| **Display** | Card, Badge, Avatar, Chip, Tooltip |
| **Feedback** | Alert, Toast, Modal, Skeleton, Progress |
| **Navigation** | Navbar, Sidebar, Tabs, Breadcrumb, Pagination |
| **Layout** | Container, Grid, Stack, Divider |

---

## 3. Action Components

### 3.1 Button

**Purpose**: Primary user actions

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
  onClick?: () => void;
}
```

**Variants**:

| Variant | Use Case |
|---------|----------|
| `primary` | Main CTA, form submit |
| `secondary` | Alternative action |
| `outline` | Low emphasis action |
| `ghost` | Minimal visual weight |
| `danger` | Destructive actions |

**Accessibility**:
- Focus ring on keyboard navigation
- `aria-disabled` when loading
- `aria-busy` during loading state

### 3.2 IconButton

**Purpose**: Icon-only actions

```typescript
interface IconButtonProps {
  icon: ReactNode;
  label: string; // Required for accessibility
  variant: 'solid' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
```

**Requirements**:
- Must have `aria-label` (via `label` prop)
- Tooltip on hover showing label

---

## 4. Input Components

### 4.1 TextField

**Purpose**: Text input with validation

```typescript
interface TextFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
}
```

**States**:

| State | Visual |
|-------|--------|
| Default | Gray border |
| Focus | Primary border + ring |
| Error | Red border + error message |
| Disabled | Muted background |

**Accessibility**:
- `aria-describedby` linking to helper/error text
- `aria-invalid` on error state
- Label always visible (no floating labels)

### 4.2 Select

**Purpose**: Dropdown selection

```typescript
interface SelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}
```

### 4.3 Checkbox

```typescript
interface CheckboxProps {
  label: string;
  name: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}
```

### 4.4 DatePicker

**Purpose**: Date selection with calendar popup

```typescript
interface DatePickerProps {
  label: string;
  name: string;
  value?: Date;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  format?: string; // Default: 'dd/MM/yyyy'
  onChange?: (date: Date) => void;
}
```

---

## 5. Display Components

### 5.1 Card

**Purpose**: Content container

```typescript
interface CardProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  children: ReactNode;
}
```

**Sub-components**:
- `Card.Header` - Title area
- `Card.Body` - Main content
- `Card.Footer` - Actions area

### 5.2 Badge

**Purpose**: Status indicators

```typescript
interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean; // Show as dot only
  children?: ReactNode;
}
```

**Color Mapping**:

| Variant | Background | Text |
|---------|------------|------|
| success | green-100 | green-800 |
| warning | yellow-100 | yellow-800 |
| error | red-100 | red-800 |
| info | blue-100 | blue-800 |
| neutral | gray-100 | gray-800 |

### 5.3 Avatar

```typescript
interface AvatarProps {
  src?: string;
  alt: string;
  name?: string; // For initials fallback
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
}
```

---

## 6. Feedback Components

### 6.1 Alert

**Purpose**: Contextual messages

```typescript
interface AlertProps {
  variant: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  children: ReactNode;
}
```

### 6.2 Toast

**Purpose**: Temporary notifications

```typescript
interface ToastProps {
  variant: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description?: string;
  duration?: number; // ms, default 5000
  action?: { label: string; onClick: () => void };
}
```

**Positioning**: Top-right corner, stacked

**Behavior**:
- Auto-dismiss after duration
- Pause on hover
- Swipe to dismiss on mobile

### 6.3 Modal

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  children: ReactNode;
}
```

**Accessibility**:
- Focus trap when open
- Return focus on close
- `aria-modal="true"`
- `role="dialog"`

### 6.4 Skeleton

**Purpose**: Loading placeholders

```typescript
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}
```

---

## 7. Navigation Components

### 7.1 Navbar

**Structure**:
```
┌──────────────────────────────────────────────────────┐
│ [Logo]    [Nav Items...]           [User] [Actions]  │
└──────────────────────────────────────────────────────┘
```

**Responsive**:
- Desktop: Full horizontal navigation
- Mobile: Hamburger menu with slide-out drawer

### 7.2 Tabs

```typescript
interface TabsProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
}

interface TabProps {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}
```

**Accessibility**:
- Arrow key navigation
- `role="tablist"` and `role="tab"`
- `aria-selected` on active tab

### 7.3 Pagination

```typescript
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  siblingCount?: number; // Pages shown around current
}
```

---

## 8. Layout Components

### 8.1 Container

**Purpose**: Constrain content width

```typescript
interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean; // Default horizontal padding
  children: ReactNode;
}
```

**Max Widths**:

| Size | Width |
|------|-------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

### 8.2 Stack

**Purpose**: Vertical/horizontal spacing

```typescript
interface StackProps {
  direction?: 'row' | 'column';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  children: ReactNode;
}
```

---

## 9. Composition Patterns

### 9.1 Form Layout

```tsx
<Stack spacing="md">
  <TextField label="Email" name="email" required />
  <TextField label="Password" name="password" type="password" required />
  <Checkbox label="Remember me" name="remember" />
  <Button variant="primary" fullWidth>
    Sign In
  </Button>
</Stack>
```

### 9.2 Card with Actions

```tsx
<Card variant="elevated">
  <Card.Header>
    <h3>Order #12345</h3>
    <Badge variant="success">Completed</Badge>
  </Card.Header>
  <Card.Body>
    <p>Order details here...</p>
  </Card.Body>
  <Card.Footer>
    <Button variant="outline">View Details</Button>
    <Button variant="primary">Reorder</Button>
  </Card.Footer>
</Card>
```

---

## 10. Component Testing

### 10.1 Required Tests

| Test Type | Coverage |
|-----------|----------|
| Unit | All props render correctly |
| Interaction | Click, focus, keyboard events |
| Accessibility | ARIA attributes, focus management |
| Visual | Snapshot for each variant |

### 10.2 Example Test

```typescript
describe('Button', () => {
  it('should render with correct variant class', () => {
    render(<Button variant="primary">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  it('should show loading spinner when loading', () => {
    render(<Button loading>Click</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('should be focusable via keyboard', () => {
    render(<Button>Click</Button>);
    userEvent.tab();
    expect(screen.getByRole('button')).toHaveFocus();
  });
});
```

---

**Cross-References:**
- Design System: `03-design/ui-ux-design-system.md`
- Coding Standards: `02-standards/coding-standards.md`
