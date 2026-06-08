# PRD — Module: Subscription

| Trường | Giá trị |
|--------|---------|
| **Project** | QuantAdmin Dashboard |
| **Module** | Subscription |
| **Version** | v1.0 |
| **Ngày tạo** | 2026-06-08 |
| **Trạng thái** | Draft — Approved for Development |

---

## Mục lục

1. [Problem Statement](#1-problem-statement)
2. [Goals](#2-goals)
3. [Non-Goals](#3-non-goals)
4. [User Stories](#4-user-stories)
5. [Data Models / TypeScript Interfaces](#5-data-models--typescript-interfaces)
6. [UI Component Breakdown](#6-ui-component-breakdown)
7. [Mock Data Plan](#7-mock-data-plan)
8. [Requirements](#8-requirements)
9. [Acceptance Criteria](#9-acceptance-criteria)
10. [Open Questions](#10-open-questions)
11. [Implementation Plan](#11-implementation-plan)
12. [Timeline & Phasing](#12-timeline--phasing)

---

## 1. Problem Statement

Hiện tại QuantAdmin không có nơi tập trung để quản lý nền kinh tế CU (Compute Unit) — định giá sự kiện, gói mua CU, và lịch sử thanh toán bị phân tán hoặc chưa có giao diện quản lý. Admin không thể điều chỉnh chi phí CU cho từng loại sự kiện bot, không thể tạo/sửa gói mua CU, và module Payments hiện đứng rời rạc thiếu liên kết với package. Điều này khiến việc vận hành và thay đổi mô hình giá CU phải làm thủ công qua code thay vì qua giao diện admin.

**Ai bị ảnh hưởng:** Super Admin, Admin vận hành nền tảng.

**Chi phí nếu không giải quyết:** Mỗi lần thay đổi giá CU event hoặc tạo gói mới phải deploy code → chậm trễ, rủi ro lỗi production, phụ thuộc kỹ thuật.

---

## 2. Goals

| # | Goal | Metric đo lường |
|---|------|-----------------|
| G1 | Admin có thể xem và chỉnh giá CU của bất kỳ event nào không cần sửa code | 100% CU events chỉnh được qua UI |
| G2 | Admin có thể tạo, sửa, xóa CU Package đầy đủ | CRUD hoạt động, có confirmation trước delete |
| G3 | Payments được liên kết với package — admin biết payment nào mua gói gì | 100% payment records có cột Package |
| G4 | Sidebar gọn: Subscription group chứa 3 sub-items thay vì Payments menu rời | Menu structure clean, không duplicate |
| G5 | Nhất quán design system hiện tại | Không có component ngoài pattern đã có |

---

## 3. Non-Goals

| Non-Goal | Lý do out of scope |
|----------|--------------------|
| Billing tích hợp thật (Stripe / Crypto Pay API) | Backend chưa kết nối, v1 dùng mock data |
| Tự động áp dụng giá CU mới cho bot đang chạy realtime | Cần backend event bus — scope v2 |
| Lịch sử thay đổi giá CU per-event (audit trail riêng) | Audit Log toàn cục đã cover |
| User-facing package marketplace (giao diện user chọn mua) | Đây là backoffice CMS, không phải user app |
| Coupon / promo code cho package | Cần xác định product-market fit trước — P2 |

---

## 4. User Stories

### Persona: Super Admin / Admin

#### 4.1 CU Event Management

| ID | Story |
|----|-------|
| US-01 | Là admin, tôi muốn **xem toàn bộ danh sách CU event** và chi phí tương ứng để hiểu rõ cấu trúc chi phí của nền tảng. |
| US-02 | Là admin, tôi muốn **chỉnh sửa giá CU** của một event cụ thể (ví dụ: tăng `CYCLE_START` từ 3 → 5 CU) để linh hoạt điều chỉnh mô hình kinh doanh. |
| US-03 | Là admin, tôi muốn **tắt/bật một CU event** (inactive/active) để tạm thời vô hiệu hóa mà không phải xóa. |
| US-04 | Là admin, tôi muốn **tạo CU event mới** (ví dụ: `REBALANCE_EXECUTED`) để hỗ trợ loại bot mới vừa được thêm vào platform. |
| US-05 | Là admin, tôi muốn **xóa CU event** không còn dùng nữa sau khi đã xác nhận. |
| US-06 | Là admin, tôi muốn **filter CU event theo category** (SPEND / BONUS / SYSTEM) để tìm nhanh nhóm event cần xem. |

#### 4.2 CU Package Management

| ID | Story |
|----|-------|
| US-07 | Là admin, tôi muốn **xem danh sách tất cả CU package** với giá, số CU và trạng thái để nắm rõ pricing hiện tại. |
| US-08 | Là admin, tôi muốn **tạo CU package mới** với tên, số CU, giá USD, % discount và trạng thái để launch offer mới. |
| US-09 | Là admin, tôi muốn **sửa thông tin package** đang có (ví dụ: tăng CU của gói Pro) mà không ảnh hưởng payment history cũ. |
| US-10 | Là admin, tôi muốn **xóa package** đã ngưng bán sau khi confirm, với cảnh báo nếu có payment liên quan. |
| US-11 | Là admin, tôi muốn **inactive một package** thay vì xóa để không hiện với user nhưng giữ lại lịch sử. |

#### 4.3 Payments (trong Subscription)

| ID | Story |
|----|-------|
| US-12 | Là admin, tôi muốn **xem toàn bộ payment history** với cột "Package" để biết user mua gói gì. |
| US-13 | Là admin, tôi muốn **filter payment theo package name** để phân tích gói nào bán chạy nhất. |
| US-14 | Là admin, tôi muốn **tìm payment bằng search** (username, TX ID, package name) để tra cứu nhanh. |

---

## 5. Data Models / TypeScript Interfaces

Tất cả interface mới thêm vào `src/types.ts`.

### 5.1 CuEvent

```typescript
export type CuEventCategory = 'SPEND' | 'BONUS' | 'SYSTEM';

export interface CuEvent {
  id: string;                      // e.g. 'evt-001'
  eventName: string;               // e.g. 'START_BOT' — uppercase
  cuCost: number;                  // positive = earn, negative = spend
  category: CuEventCategory;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdDate: string;             // ISO date string 'YYYY-MM-DD'
}
```

### 5.2 CuPackage

```typescript
export interface CuPackage {
  id: string;                      // e.g. 'pkg-001'
  name: string;                    // e.g. 'Pro Pack'
  cuAmount: number;                // e.g. 10000
  priceUsd: number;                // e.g. 79.99
  discountPercent: number;         // 0–100
  status: 'ACTIVE' | 'INACTIVE';
  badge?: string;                  // e.g. 'POPULAR' | 'BEST VALUE'
  createdDate: string;
}
```

### 5.3 PaymentRecord (extend existing)

```typescript
// Bổ sung 2 field vào interface PaymentRecord đã có
export interface PaymentRecord {
  id: string;
  username?: string;
  packageId?: string;              // NEW — link tới CuPackage.id
  packageName?: string;           // NEW — denormalized display name
  timestamp: string;
  amountUsd: number;
  cuCredited: number;
  method: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}
```

---

## 6. UI Component Breakdown

### 6.1 Submodule: CU Events — `CuEventsView.tsx`

```
CuEventsView
├── Header
│   ├── Title: "CU Events"
│   ├── Badge: tổng số events
│   └── Button: [+ Add Event]
├── Toolbar
│   ├── Search input (filter theo eventName)
│   └── Tab filter: All | SPEND | BONUS | SYSTEM
├── Table
│   ├── Col: Event Name (font-mono, uppercase)
│   ├── Col: Category (badge — SPEND=red, BONUS=emerald, SYSTEM=blue)
│   ├── Col: CU Cost (negative=red, positive=green, SYSTEM=slate)
│   ├── Col: Description
│   ├── Col: Status (ToggleRight/ToggleLeft — click to toggle inline)
│   └── Col: Actions — [Edit] [Delete]
├── Add/Edit Modal
│   ├── Field: Event Name (text, uppercase enforced, required, unique)
│   ├── Field: Category (select: SPEND / BONUS / SYSTEM)
│   ├── Field: CU Cost (number, negative cho SPEND)
│   ├── Field: Description (textarea)
│   ├── Field: Status (button toggle Active/Inactive)
│   └── Footer: [Cancel] [Save]
└── Delete Confirmation Modal
    └── "Delete event [NAME]? This cannot be undone."
```

**Visual rules:**
- `SPEND` category: cost hiển thị màu đỏ (e.g. `-5 CU`)
- `BONUS` category: cost hiển thị màu xanh (e.g. `+500 CU`)
- `SYSTEM` category: cost hiển thị màu slate (e.g. `0 CU` hoặc `variable`)
- Event INACTIVE: row mờ `opacity-60`

---

### 6.2 Submodule: CU Packages — `CuPackagesView.tsx`

```
CuPackagesView
├── Header
│   ├── Title: "CU Packages"
│   └── Button: [+ New Package]
├── Summary Stats Bar
│   ├── Active Packages: X
│   ├── Total CU Sold: X,XXX,XXX
│   └── Total Revenue: $X,XXX
├── View Toggle: [Cards] [Table]
├── Cards Grid (default, responsive 1→2→3 cols)
│   └── Package Card
│       ├── Badge (POPULAR / BEST VALUE / none)
│       ├── Status indicator (dot — green=active, gray=inactive)
│       ├── Package Name (h3)
│       ├── CU Amount (large display — e.g. "10,000 CU")
│       ├── Price row:
│       │   ├── Nếu discount > 0: giá gốc strikethrough + giá sau discount
│       │   └── Nếu discount = 0: giá bình thường
│       ├── Discount badge (nếu có — e.g. "-20%")
│       ├── Status toggle (Active/Inactive)
│       └── Actions: [Edit] [Delete]
├── Table View (alternate)
│   └── Cols: Name | CU Amount | Price | Discount | Status | Created | Actions
├── Add/Edit Modal
│   ├── Field: Package Name (text, required)
│   ├── Field: CU Amount (number, required)
│   ├── Field: Price USD (number, required)
│   ├── Field: Discount % (number 0–100)
│   ├── Field: Badge label (text, optional)
│   ├── Field: Status (Active/Inactive toggle)
│   ├── Preview: "Effective price: $XX.XX" (tính realtime từ price - discount)
│   └── Footer: [Cancel] [Save]
└── Delete Confirmation Modal
    ├── "Delete package [NAME]?"
    └── Warning nếu có payment liên quan: "This package has X associated payments."
```

---

### 6.3 Submodule: Payments — `SubscriptionPaymentsView.tsx`

```
SubscriptionPaymentsView
├── Header
│   ├── Title: "Payments"
│   └── Button: [Export CSV]
├── Stats Row
│   ├── Total Revenue: $X,XXX
│   ├── Success: X
│   ├── Pending: X
│   └── Failed: X
├── Filter Bar
│   ├── Search input (username / TX ID / package name)
│   ├── Filter: Status (All | SUCCESS | PENDING | FAILED)
│   └── Filter: Package (dropdown — từ danh sách CuPackage)
└── Table
    ├── Col: TX ID (font-mono)
    ├── Col: Username
    ├── Col: Package (NEW — pill badge, "—" nếu null)
    ├── Col: Amount USD
    ├── Col: CU Credited
    ├── Col: Method
    ├── Col: Status (badge — SUCCESS=emerald, PENDING=amber, FAILED=red)
    └── Col: Date (sortable)
```

---

### 6.4 Sidebar Changes

```
Sidebar menu order (sau khi update):
  CU Reports
  Trading Report
  AI ▾
    └── AI Monitor
    └── AI Support Models
  Subscription ▾              ← NEW collapsible group
    └── CU Events              ← route: 'sub_cu_events'
    └── CU Packages            ← route: 'sub_cu_packages'
    └── Payments               ← route: 'sub_payments' (moved từ top-level)
  Users
  Strategies
  Exchanges
  Admins
  Audit Log
  Settings
```

> **Lưu ý:** Menu item `Payments` top-level (`payments_all`) bị XÓA, thay bằng `sub_payments` bên trong Subscription group.

---

## 7. Mock Data Plan

File: `src/features/subscription/data.ts`

### 7.1 INITIAL_CU_EVENTS (8 events)

| ID | Event Name | Category | CU Cost | Status |
|----|------------|----------|---------|--------|
| evt-001 | SIGNUP_BONUS | BONUS | +500 | ACTIVE |
| evt-002 | START_BOT | SPEND | -5 | ACTIVE |
| evt-003 | CYCLE_START | SPEND | -3 | ACTIVE |
| evt-004 | DCA_EXECUTED | SPEND | -2 | ACTIVE |
| evt-005 | SELL_EXECUTED | SPEND | -2 | ACTIVE |
| evt-006 | ADD_SUB_BALANCE | SYSTEM | 0 | ACTIVE |
| evt-007 | REFERRAL_BONUS | BONUS | +200 | ACTIVE |
| evt-008 | API_ERROR_REFUND | SYSTEM | 0 | ACTIVE |

### 7.2 INITIAL_CU_PACKAGES (5 packages)

| ID | Name | CU | Price USD | Discount | Badge | Status |
|----|------|----|-----------|----------|-------|--------|
| pkg-001 | Starter Pack | 1,000 | $9.99 | 0% | — | ACTIVE |
| pkg-002 | Basic Pack | 3,000 | $24.99 | 0% | — | ACTIVE |
| pkg-003 | Pro Pack | 10,000 | $79.99 | 10% | POPULAR | ACTIVE |
| pkg-004 | VIP Bundle | 25,000 | $179.99 | 20% | BEST VALUE | ACTIVE |
| pkg-005 | Legacy Pack | 5,000 | $49.99 | 0% | — | INACTIVE |

### 7.3 MOCK_ALL_PAYMENTS (extend existing 8 records)

Thêm `packageId` và `packageName` vào từng record:

```
pay-772 → pkg-004 "VIP Bundle"
pay-651 → pkg-002 "Basic Pack"
pay-213 → pkg-003 "Pro Pack"
pay-890 → pkg-002 "Basic Pack"
pay-512 → pkg-001 "Starter Pack"
pay-301 → pkg-004 "VIP Bundle"
pay-144 → pkg-002 "Basic Pack"
pay-088 → pkg-004 "VIP Bundle"
```

---

## 8. Requirements

### P0 — Must Have (Không thể ship thiếu)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R01 | Hiển thị danh sách CU Events với search và category filter | Table render đủ events; search lọc realtime; tab filter hoạt động đúng |
| R02 | Edit CU event (cost, description, status) qua modal | Modal pre-populate; save cập nhật state; toast success |
| R03 | Tạo CU event mới với validation (tên không rỗng, không trùng) | Form validate trước submit; duplicate name bị block với error message |
| R04 | Xóa CU event có confirmation modal | Confirm modal hiện tên event; xóa xong remove khỏi list |
| R05 | Toggle active/inactive trực tiếp trên table row | Click toggle đổi trạng thái ngay; không cần mở modal |
| R06 | Hiển thị CU Packages (card view mặc định) | 5 packages render; inactive package mờ rõ ràng |
| R07 | Tạo / Sửa / Xóa CU Package đầy đủ | Full CRUD; delete có warning nếu có payment liên quan |
| R08 | Preview giá sau discount khi tạo/sửa package | Effective price tính realtime ngay khi nhập discount % |
| R09 | Payments hiển thị cột Package Name | 100% records có packageName hoặc "—" |
| R10 | Filter payment theo package | Dropdown filter; kết quả lọc đúng |
| R11 | Sidebar Subscription group với 3 sub-items | Collapsible; auto-expand khi vào sub-route |
| R12 | Xóa top-level Payments menu | `payments_all` route không còn trong sidebar |

### P1 — Nice to Have

| ID | Requirement |
|----|-------------|
| R13 | Summary stats bar trên CuPackagesView (packages active, total revenue) |
| R14 | Badge POPULAR / BEST VALUE hiển thị trên package card |
| R15 | Sortable columns trên Payments table (Amount, Date) |
| R16 | Table view toggle cho CU Packages (Cards ↔ Table) |
| R17 | Search/filter CU Events theo eventName |
| R18 | Audit Log entry khi admin thay đổi CU event cost |

### P2 — Future Considerations

| ID | Requirement |
|----|-------------|
| R19 | CU Event pricing history / audit trail per event |
| R20 | Coupon / promo code cho package |
| R21 | Package usage analytics (biểu đồ revenue per package) |
| R22 | Bulk activate/deactivate packages |
| R23 | Import/Export CU event config (JSON) |

---

## 9. Acceptance Criteria

### 9.1 CU Events

```gherkin
Scenario: Thêm CU event mới
  Given admin ở CU Events page
  When admin click [+ Add Event] và điền đầy đủ form
  Then event mới xuất hiện trong table
  And toast "Event created successfully" hiển thị

Scenario: Validation tên trùng
  Given eventName "START_BOT" đã tồn tại
  When admin nhập "START_BOT" và submit
  Then form hiển thị error "Event name already exists"
  And không tạo event mới

Scenario: Toggle status inline
  Given event "CYCLE_START" đang ACTIVE
  When admin click toggle trên row đó
  Then status đổi thành INACTIVE ngay lập tức
  And row mờ opacity-60

Scenario: Delete event
  Given admin click [Delete] trên event "ADD_SUB_BALANCE"
  When confirm modal xuất hiện → admin click "Delete"
  Then event bị xóa khỏi table
  And toast "Event deleted successfully" hiển thị
```

### 9.2 CU Packages

```gherkin
Scenario: Preview giá sau discount
  Given admin mở modal tạo package
  When admin nhập Price = $100 và Discount = 20%
  Then preview hiển thị "Effective price: $80.00" ngay lập tức

Scenario: Delete package có payment liên quan
  Given package "Pro Pack" có 3 payment records
  When admin click [Delete] trên package này
  Then confirm modal hiển thị cảnh báo:
    "This package has 3 associated payments. Deleting it will not affect payment history."

Scenario: Toggle inactive
  Given admin toggle package "Legacy Pack" sang INACTIVE
  Then package card hiển thị opacity giảm và badge "INACTIVE"
  And package vẫn còn trong danh sách (không bị xóa)
```

### 9.3 Payments

```gherkin
Scenario: Filter theo package
  Given admin chọn "Pro Pack" từ filter dropdown
  Then chỉ hiện payments có packageName = "Pro Pack"

Scenario: Package null handling
  Given một payment record không có packageId
  Then cột Package hiển thị "—" (dash)
  Và không để ô trống hoặc hiển thị undefined

Scenario: Search kết hợp
  Given admin nhập "delta" vào search box
  Then kết quả lọc theo username chứa "delta"
```

---

## 10. Open Questions

| # | Question | Owner | Blocking? | Ghi chú |
|---|----------|-------|-----------|---------|
| Q1 | Khi admin thay đổi CU cost của event, áp dụng ngay cho bot đang chạy hay chỉ cho event mới? | Backend / Product | ⚠️ Blocking cho v2 | V1 mock data nên không ảnh hưởng |
| Q2 | Xóa CU Package nên soft-delete (inactive) hay hard-delete? | Product | Không — v1 dùng hard delete với confirmation | Recommend soft delete cho v2 |
| Q3 | Payment filter theo package — single select hay multi-select? | Design | Không — v1 dùng single select | Multi-select nếu có nhiều packages |
| Q4 | CU Event "variable" (như API_ERROR_REFUND) — admin set giá thế nào? | Product | Không | V1: cuCost = 0, description ghi "variable" |
| Q5 | Subscription group trong sidebar đặt ở vị trí nào? | Design | Không | Đề xuất: sau Trading Report, trước AI group |

---

## 11. Implementation Plan

### Files to Create

| File | Mô tả | Dòng ước tính |
|------|-------|---------------|
| `src/features/subscription/data.ts` | Mock data: CU events, packages, extended payments | ~120 |
| `src/features/subscription/CuEventsView.tsx` | Submodule 1 — table + CRUD modals | ~350 |
| `src/features/subscription/CuPackagesView.tsx` | Submodule 2 — cards/table + CRUD modals | ~400 |
| `src/features/subscription/SubscriptionPaymentsView.tsx` | Submodule 3 — enhanced payments với package filter | ~250 |

### Files to Modify

| File | Thay đổi cụ thể |
|------|-----------------|
| `src/types.ts` | Thêm `CuEvent`, `CuPackage`; extend `PaymentRecord` với `packageId?`, `packageName?` |
| `src/shared/constants/routes.ts` | Thêm `SUB_CU_EVENTS`, `SUB_CU_PACKAGES`, `SUB_PAYMENTS`; deprecate `PAYMENTS_ALL` |
| `src/shared/components/Sidebar.tsx` | Thêm Subscription collapsible group; xóa top-level Payments item |
| `src/features/payments/data.ts` | Extend `MOCK_ALL_PAYMENTS` với `packageId/packageName` fields |
| `src/App.tsx` | Thêm state `cuEvents`, `cuPackages`; thêm handlers; wire 3 routes mới; xóa `payments_all` case |

### Files to Remove

| File | Action |
|------|--------|
| `src/features/payments/PaymentsAllView.tsx` | Xóa sau khi `SubscriptionPaymentsView` live và đã test |

---

## 12. Timeline & Phasing

```
Phase 1 — Data & Types (nửa ngày)
  ✦ Thêm CuEvent, CuPackage vào types.ts
  ✦ Extend PaymentRecord với packageId, packageName
  ✦ Thêm routes mới vào routes.ts
  ✦ Tạo src/features/subscription/data.ts với full mock data
  ✦ Extend MOCK_ALL_PAYMENTS trong features/payments/data.ts

Phase 2 — Views (1–2 ngày)
  ✦ CuEventsView.tsx — table + search + category filter + CRUD modals
  ✦ CuPackagesView.tsx — card grid + CRUD modals + discount preview
  ✦ SubscriptionPaymentsView.tsx — table + package filter + search

Phase 3 — Wiring & Cleanup (nửa ngày)
  ✦ Sidebar.tsx — thêm Subscription group, xóa Payments top-level
  ✦ App.tsx — wire state, handlers, routes
  ✦ Xóa PaymentsAllView.tsx
  ✦ TypeScript check (npx tsc --noEmit)
  ✦ Push to GitHub
```

**Tổng ước tính:** 2–3 ngày developer time.

---

*Spec này đã được review và approved. Mọi thay đổi scope cần cập nhật lại document này và ghi rõ version.*
