# UI Design: Keyword Spy Management

> **Domain:** Project Management  
> **Feature ID:** PM-F08  
> **Reference:** [Feature PRD](../../../1.business-analyst/domains/project-management/features/keyword-spy/feature-prd.md)

---

## 1. Page Structure

### 1.1. Keyword Spy Management Page

**Route:** `/projects/:projectId/spy-keywords`

**Layout:**
- Located in Project sidebar navigation
- Separate section from ASO Keywords
- Full-page layout with filters and list view

---

## 2. Components

### 2.1. SpyKeywordsListPage

**Main page component for managing spy keywords.**

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Project Name] > Keyword Spy                                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ Filters:                                                      │
│ [Status: All ▼] [Platform: All ▼] [Search...] [Reset]       │
│                                                               │
│ [+ Add Spy Keyword]                    [Bulk Actions ▼]     │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│ Keyword          │ Platforms        │ Status │ Stats │ Actions│
├─────────────────────────────────────────────────────────────┤
│ fitness app      │ Meta, TikTok Ads │ Active │ 45 ads│ [⋮]   │
│ workout tracker  │ All              │ Active │ 12 ads│ [⋮]   │
│ pilates          │ Meta Ads         │ Paused │ 8 ads │ [⋮]   │
├─────────────────────────────────────────────────────────────┤
│                              [< Prev] [1] [2] [3] [Next >]  │
└─────────────────────────────────────────────────────────────┘
```

**Table Columns:**
1. **Keyword** - Text with description tooltip
2. **Platforms** - Badge list (Meta Ads, TikTok Ads, etc.)
3. **Status** - Badge (Active, Paused, Inactive)
4. **Stats** - Shows adsCount, videosCount, postsCount
5. **Actions** - Dropdown menu (View, Edit, Crawl, Delete)

**Filters:**
- Status: All, Active, Paused, Inactive
- Platform: All, Meta Ads, TikTok Ads, Google Ads, etc.
- Search: Text search in keyword text

---

### 2.2. CreateSpyKeywordModal

**Modal for creating new spy keyword.**

```
┌─────────────────────────────────────────┐
│ Add Spy Keyword                    [×]  │
├─────────────────────────────────────────┤
│                                         │
│ Keyword: *                              │
│ [___________________________]           │
│                                         │
│ Platforms: *                            │
│ ☑ Meta Ads (Facebook, Instagram)       │
│ ☑ TikTok Ads                            │
│ ☐ Google Ads                            │
│ ☐ TikTok (organic)                      │
│ ☐ Instagram (organic)                   │
│ ☐ YouTube                               │
│ ☐ Facebook (organic)                    │
│ ☐ All platforms                         │
│                                         │
│ Description (optional):                 │
│ [___________________________]           │
│ [___________________________]           │
│                                         │
│ Tags: [fitness] [app] [+ Add tag]      │
│                                         │
│ ☑ Auto-crawl after creation             │
│                                         │
│                    [Cancel] [Add Keyword]│
└─────────────────────────────────────────┘
```

**Form Fields:**
- Keyword text (required, max 200 chars)
- Platforms (required, multi-select checkboxes)
- Description (optional, textarea)
- Tags (optional, tag input)
- Auto-crawl checkbox (default: unchecked)

**Validation:**
- Keyword text required and non-empty
- At least one platform required
- Show error if duplicate keyword in project

---

### 2.3. SpyKeywordCard

**Card component for displaying keyword in list/grid view.**

```
┌─────────────────────────────────────┐
│ fitness app              [Active]   │
│                                       │
│ Platforms:                            │
│ [Meta Ads] [TikTok Ads]              │
│                                       │
│ Stats:                                │
│ 📊 45 ads  📹 0 videos  📝 0 posts   │
│                                       │
│ Last crawled: Dec 15, 2025 10:30 AM │
│                                       │
│                    [View] [Crawl] [⋮]│
└─────────────────────────────────────┘
```

**Display:**
- Keyword text (header)
- Status badge
- Platform badges
- Stats with icons
- Last crawled timestamp
- Action buttons

---

### 2.4. SpyKeywordDetailModal

**Modal for viewing keyword details and results.**

```
┌─────────────────────────────────────────┐
│ Keyword: "fitness app"             [×]  │
├─────────────────────────────────────────┤
│                                         │
│ Status: [Active ▼]                      │
│                                         │
│ Platforms: Meta Ads, TikTok Ads         │
│                                         │
│ Description:                            │
│ Monitor fitness-related ads...          │
│                                         │
│ Tags: [fitness] [app]                   │
│                                         │
│ Stats:                                  │
│ - Ads Found: 45                         │
│ - Videos Found: 0                       │
│ - Posts Found: 0                        │
│                                         │
│ Last Crawled: Dec 15, 2025 10:30 AM   │
│                                         │
│ [Crawl Now] [Edit] [Pause] [Delete]    │
│                                         │
├─────────────────────────────────────────┤
│ Discovered Content                      │
├─────────────────────────────────────────┤
│ Tabs: [Ads (45)] [Videos (0)] [Posts] │
│                                         │
│ [List of discovered content cards]      │
│                                         │
└─────────────────────────────────────────┘
```

**Tabs:**
- Ads - List of discovered ads
- Videos - List of discovered videos
- Posts - List of discovered posts

---

### 2.5. EditSpyKeywordModal

**Modal for editing existing spy keyword.**

Similar to CreateSpyKeywordModal but:
- Pre-filled with existing values
- Cannot edit keyword text (immutable)
- Shows current status
- Save button instead of Add button

---

## 3. User Interactions

### 3.1. Add Keyword Flow

1. User clicks "Add Spy Keyword"
2. Modal opens
3. User fills form:
   - Enters keyword text
   - Selects platforms (checkboxes)
   - Optionally adds description and tags
   - Optionally enables auto-crawl
4. User clicks "Add Keyword"
5. Validation runs
6. If valid, API call creates keyword
7. If auto-crawl enabled, crawl job triggers
8. Modal closes, list refreshes

### 3.2. View Keyword Results Flow

1. User clicks on keyword row or "View" button
2. Detail modal opens
3. User sees keyword info and stats
4. User clicks "Ads" tab to see discovered ads
5. User can filter/sort results
6. User can click on ad to view ad detail

### 3.3. Trigger Manual Crawl Flow

1. User clicks "Crawl" button on keyword
2. Confirmation dialog appears
3. User confirms
4. API call triggers crawl
5. Loading state shows
6. Notification confirms crawl started
7. Stats update after crawl completes

---

## 4. States & Feedback

### 4.1. Loading States

- **Creating keyword:** Button shows spinner
- **Fetching list:** Table shows skeleton loaders
- **Crawling:** Status badge shows "Crawling..." indicator

### 4.2. Empty States

- **No keywords:** "No spy keywords yet. Add your first keyword to start monitoring competitors."
- **No results:** "No content found for this keyword yet. Trigger a crawl to discover content."

### 4.3. Error States

- **Duplicate keyword:** "Keyword 'fitness app' already exists in this project"
- **Validation error:** Inline errors under form fields
- **API error:** Toast notification with error message

### 4.4. Success Feedback

- **Created:** Toast: "Spy keyword 'fitness app' created successfully"
- **Updated:** Toast: "Spy keyword updated successfully"
- **Deleted:** Toast: "Spy keyword deleted successfully"
- **Crawl triggered:** Toast: "Crawl started for 'fitness app'"

---

## 5. Responsive Design

### 5.1. Mobile Layout

- Stack filters vertically
- Table becomes card list
- Modal full-screen on mobile
- Action buttons become bottom sheet

### 5.2. Tablet Layout

- Filters in sidebar
- Table with horizontal scroll if needed
- Modal centered with max width

---

## 6. Accessibility

- **Keyboard navigation:** Tab through form fields, Enter to submit
- **Screen readers:** ARIA labels for status badges, stats, actions
- **Color contrast:** Status badges meet WCAG AA
- **Focus indicators:** Visible focus rings on interactive elements

---

## 7. Design Tokens

**Colors:**
- Active status: Green (#10B981)
- Paused status: Yellow (#F59E0B)
- Inactive status: Gray (#6B7280)

**Spacing:**
- Modal padding: 24px
- Table row height: 64px
- Card padding: 16px

**Typography:**
- Page title: H1 (24px, bold)
- Keyword text: Body (16px, semibold)
- Stats: Body (14px, regular)

