CLUB INFICATION CRM
MASTER SYSTEM ARCHITECTURE & IMPLEMENTATION SPECIFICATION
NestJS + React + PostgreSQL | Modular Monolith
Version 1.0 — Architecture contract for Antigravity / AI coding agent
Primary functional source: Club Infication CRM Functional Requirements & Role Access PDF supplied by the client.
Supporting context: https://clubinfication.com/
Club Infication CRM — Master Architecture Specification v1.0
0. HOW TO USE THIS DOCUMENT
This document is the implementation architecture contract for the Club Infication CRM. The attached client PDF remains the highest authority for confirmed functional requirements and role access. This document converts those requirements into a consistent technical architecture.
0.1 Source-of-truth hierarchy
1. Client-provided CRM requirements PDF — highest authority for functional requirements and role access.
2. Explicit client clarifications/decisions made after the PDF — may resolve or refine ambiguity.
3. This Master Architecture Specification — technical architecture and implementation structure.
4. Existing code — preserve working functionality unless it conflicts with the above.
5. Club Infication website — supporting business context only; do not infer CRM rules from it.
0.2 Non-negotiable AI-agent rules
Do not invent undocumented business rules. Mark ambiguity as CLIENT_CLARIFICATION_REQUIRED.
The CRM has exactly three login roles: SUPER_ADMIN, MANAGER, EXECUTIVE.
Customers are CRM records, not CRM login users.
Backend authorization is the real security boundary; React UI checks are not security.
Every protected operation must enforce authentication + permission/role + record/team scope.
Do not put business logic in controllers or React components.
PostgreSQL is the authoritative source of truth.
Do not use Redis as the source of truth for financial, membership, entitlement or booking state.
Do not introduce microservices, Kafka or Kubernetes without explicit approval/need.
Critical deal, payment, refund, entitlement and booking operations must use transactions where applicable.
Do not model entitlement usage only as remaining_days/remaining_nights; maintain an auditable ledger.
Salary information requires stricter authorization than ordinary sales information.
Implement only the requested phase; do not silently implement future phases.
After every phase run lint, typecheck, tests and build; report results.
1. BUSINESS CONTEXT
Club Infication is a vacation/holiday membership and booking company. Much of the current customer, sales, membership, payment and usage information is maintained in Excel. The CRM will centralize the records and replace the Excel-based operational process.
1.1 Core lifecycle
Lead
  ↓
Sales Executive
  ↓
Call / Follow-up
  ↓
Presentation
  ↓
Package Selection
  ↓
Deal
  ↓
Payment
  ↓
Deal Closed
  ↓
Customer / Membership
  ↓
Holiday Entitlement
  ↓
Booking / Usage
  ↓
Entitlement Ledger / History
1.2 Domain distinctions
Lead = prospective customer/sales opportunity.
Customer = customer master record.
Deal = commercial sales transaction/opportunity.
Package = reusable holiday product/plan definition.
Membership = customer's purchased instance of a package.
Entitlement = benefits/days/nights available under a membership.
Entitlement transaction = auditable movement of entitlement.
Booking = reservation/usage against membership entitlement.
Payment = money received.
Refund = money returned and recorded against the relevant financial context.
2. RBAC AND TEAM MODEL
Role
Data scope
Key capabilities
SUPER_ADMIN
All records
Full system administration, all customers, sales, memberships, payments, usage, refunds, incentives, reports.
MANAGER
Own team only
View/manage assigned executives and their customers/sales/membership/payment/usage/incentive information.
EXECUTIVE
Own assigned records
Create/manage own customer records, membership/plan data, payments, usage and own sales/incentives.

2.1 Team hierarchy
SUPER ADMIN
   ├── MANAGER 1
   │     ├── EXECUTIVE 1
   │     ├── EXECUTIVE 2
   │     └── EXECUTIVE 3
   └── MANAGER 2
         ├── EXECUTIVE 4
         ├── EXECUTIVE 5
         └── EXECUTIVE 6
2.2 Authorization rule
SUPER_ADMIN → global scope
MANAGER     → current manager's team scope
EXECUTIVE   → current executive's own-record scope
Example: Manager 1 requesting a customer owned by Manager 2 must receive DENIED even when the customer ID is valid. An Executive must not gain access to another Executive's record by changing an ID in the URL/API request.
3. SYSTEM ARCHITECTURE
                        React Web Application
                                  │
                    React Router / TanStack Query
                                  │
                              HTTPS / REST
                                  │
                         NestJS Modular Monolith
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
          AuthN                 AuthZ              Business
             │                    │                 Modules
             │             RBAC + Record Scope          │
             │                    │          ┌─────────┼─────────┐
             ▼                    ▼         Leads   Customers  Deals
                                          Packages Membership Entitlements
                                           Bookings Payments Incentives
                                               │
                                               ▼
                                          PostgreSQL
                                         SOURCE OF TRUTH

                       Optional supporting infrastructure
                     Redis | BullMQ | Object Storage | Monitoring
Use a modular monolith initially.
Keep business modules independently organized with clear ownership of rules.
Use PostgreSQL as the source of truth.
Use Redis only where justified for caching/coordination/queues.
Use BullMQ/equivalent for background work such as imports, emails and heavy reports.
Use object storage for documents/files.
4. NESTJS BACKEND STRUCTURE
backend/src/
├── app.module.ts
├── config/
├── database/
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   ├── pipes/
│   └── utils/
├── auth/
├── users/
├── roles/
├── permissions/
├── teams/
├── leads/
├── activities/
├── customers/
├── deals/
├── packages/
├── memberships/
├── entitlements/
├── bookings/
├── payments/
├── refunds/
├── incentives/
├── salaries/
├── reports/
├── documents/
├── notifications/
├── imports/
└── audit/
4.1 Backend layer contract
Controller
  ↓
DTO / Validation
  ↓
Authentication
  ↓
Authorization / Scope Policy
  ↓
Application Service
  ↓
Domain Service / Business Rules
  ↓
Repository / Data Access
  ↓
Prisma
  ↓
PostgreSQL
Controllers handle HTTP only.
DTOs validate request input.
Guards/policies enforce authentication and authorization.
Application services orchestrate use cases and transaction boundaries.
Domain services own business rules/calculations.
Repositories own scoped persistence queries.
5. REACT FRONTEND STRUCTURE
frontend/src/
├── app/
│   ├── router/
│   ├── providers/
│   └── query-client/
├── auth/
├── users/
├── teams/
├── leads/
├── activities/
├── customers/
├── deals/
├── packages/
├── memberships/
├── entitlements/
├── bookings/
├── payments/
├── refunds/
├── incentives/
├── reports/
├── imports/
├── notifications/
├── audit/
├── components/
└── shared/
React Router for navigation/protected routes.
TanStack Query for server state.
React Hook Form + Zod for forms and validation.
Role-based UI controls visibility only; backend authorization remains authoritative.
Organize frontend by business feature/domain, not one giant components/pages folder.
6. DOMAIN MODULES
Module
Responsibility
Authentication
Login, token lifecycle, password/security flows.
Users
Employee/login-user profiles and status.
Roles & Permissions
Role and fine-grained access definitions.
Teams
Manager-to-executive team relationships.
Leads
Prospects, ownership, status and conversion.
Activities
Calls, follow-ups, notes and sales activities.
Customers
Customer master records and search.
Deals
Sales lifecycle and deal closure.
Packages
Package definitions and versions.
Memberships
Customer purchase instances.
Entitlements
Days/nights/benefits available to memberships.
Bookings
Holiday reservations/usage.
Payments
Payment history, paid and pending amounts.
Refunds
Refund amount/date/reason/history.
Incentives
Configurable executive incentive rules/calculation.
Salaries
Employee salary records with stricter permissions.
Reports
Role-scoped dashboards and reports.
Documents
Customer/membership document metadata and files.
Notifications
Email/background notification workflows.
Audit
Immutable/controlled business and security audit trail.
Imports
Excel staging, validation, mapping, approval and reconciliation.

7. DATABASE ARCHITECTURE
User ── Role
User ── Team
Team ── Manager / Executives

Lead ── assigned Executive / Team
Customer ── assigned Executive / Team
Customer ── Deals
Customer ── Memberships
Customer ── Payments
Customer ── Refunds
Customer ── Bookings
Customer ── Documents

Package ── PackageVersion
PackageVersion ── Membership
Membership ── Entitlements
Entitlement ── EntitlementTransactions

Deal ── Payments
Booking ── EntitlementTransactions

User ── IncentivePlan / IncentiveRule
User ── SalaryRecord

AuditLog ── actor + target entity/context
7.1 Major entities
Entity
Purpose
Important concepts
users
CRM login users/employees
role, team, status, audit fields
roles
Three login roles
SUPER_ADMIN, MANAGER, EXECUTIVE
permissions
Fine-grained access
permission key/description
teams
Manager team structure
manager + executives
leads
Prospects
owner, status, contact data
activities
Sales activities
type, owner, date, notes
customers
Customer master
identity/contact, owner/team, status
deals
Sales transactions
customer, owner, amount, status
packages
Reusable plan
logical package definition
package_versions
Versioned plan terms
price, validity, days, nights
memberships
Customer purchase
customer, package version, status, validity
entitlements
Customer benefits
membership, day/night allocations
entitlement_transactions
Usage ledger
type, quantity, reference, timestamp
bookings
Holiday usage/reservation
customer, membership, dates, status
payments
Money received
amount, date, status, related deal/membership
refunds
Money returned
amount, date, reason, related records
incentive_rules
Compensation rules
employee/rule/effective period
salary_records
Sensitive salary
employee, amount, effective period
documents
File metadata
entity reference, storage key, type
audit_logs
Audit trail
actor, action, entity, timestamp
import_batches/staging
Migration control
row validation/mapping/import state

7.2 Database rules
Use consistent primary keys and foreign keys.
Add unique constraints for confirmed business identifiers.
Use created_at/updated_at and appropriate actor fields.
Do not soft-delete immutable financial/ledger history.
Index real query patterns: team/owner, membership ID, customer search, pending payments, booking history and audit history.
Avoid unnecessary indexes because indexes have write/storage cost.
Use pagination and avoid N+1 queries.
8. ENTITLEMENT LEDGER — CRITICAL
Do not implement entitlement usage only by decrementing a remaining_days or remaining_nights column. The system must preserve an auditable history of entitlement movements.
ENTITLEMENT
   │
   └── TRANSACTIONS
        ├── ALLOCATION      +8
        ├── RESERVATION     -3   (if approved)
        ├── CONSUMPTION     -3
        ├── RELEASE         +3
        ├── TRANSFER        ±N   (if approved)
        ├── GIFT            -N   (if approved)
        ├── ADJUSTMENT      ±N
        └── EXPIRY          closes applicable availability

Balance = sum(valid ledger transactions)
Only enable transaction types supported by confirmed client rules. Do not invent rules for gifts, transfers, splits, advances or quarterly usage merely because they are possible.
9. CRITICAL TRANSACTIONS & CONCURRENCY
9.1 Deal closure
BEGIN TRANSACTION
1. Validate deal and authorization
2. Record/confirm payment
3. Create/update customer
4. Create membership
5. Allocate entitlement
6. Create applicable incentive record
7. Create audit record
COMMIT
9.2 Holiday booking
BEGIN TRANSACTION
1. Authenticate and authorize
2. Validate customer/membership/entitlement scope
3. Lock relevant entitlement row(s)
4. Re-check available entitlement
5. Validate booking rules
6. Create booking
7. Create entitlement ledger transaction(s)
8. Create audit record
COMMIT
Use PostgreSQL transactions and appropriate row locking (e.g. SELECT FOR UPDATE where applicable).
Prevent concurrent requests from consuming more entitlement than available.
Use idempotency controls where duplicate requests are possible.
Prevent duplicate payments, bookings and accidental duplicate deal closure.
Use optimistic locking/versioning where useful.
10. PAYMENTS & REFUNDS
Track total plan/deal amount.
Track amount paid.
Track pending amount.
Maintain payment history rather than overwriting one payment value.
Record refund amount, date, reason and history against the relevant records.
Financial mutations must be auditable.
Restrict editing of historical financial records according to role/permission.
11. INCENTIVES & SALARIES
11.1 Incentives
Support executive sales, target/achievement, eligible sales, incentive earned and paid/pending.
Make incentive rules configurable and versioned/effective-dated.
Do not hard-code incentive percentages/slabs.
Final incentive rules/slabs must come from Club Infication.
Refund/cancellation treatment must follow the final client-approved rules.
11.2 Salaries
Employees may have different salaries.
Salary records require stricter permissions than ordinary sales/customer data.
Do not expose salary through generic user/customer endpoints.
Do not hard-code salary values.
12. EXCEL MIGRATION
Excel/XLS
   ↓
Upload
   ↓
Validate
   ↓
Normalize
   ↓
Deduplicate
   ↓
Map Users / Teams / Packages
   ↓
Preview
   ↓
Approve
   ↓
Import
   ↓
Reconciliation
Import available customer details, membership IDs, previous/current plans, payment information, validity, used/remaining days/nights and assigned manager/executive.
Preserve previous plan history and current active plan where source data supports it.
Use staging tables for controlled migration.
Use background workers for large imports.
Do not silently discard invalid rows; provide validation results.
Reconcile imported totals/counts against the source.
13. REST API ARCHITECTURE
Area
Base route
Scope
Auth
/auth
Authentication/token lifecycle
Users/RBAC
/users, /roles, /permissions
Administrative access
Teams
/teams
Manager/team structure
Leads
/leads
Lead lifecycle and assignment
Activities
/activities
Calls/follow-ups/notes
Customers
/customers
Customer CRUD/search
Deals
/deals
Sales lifecycle/close
Packages
/packages
Package/version management
Memberships
/memberships
Customer purchases
Entitlements
/entitlements
Balance and ledger
Bookings
/bookings
Holiday booking/usage
Payments
/payments
Payment history
Refunds
/refunds
Refund history
Incentives
/incentives
Rules/calculation/status
Reports
/reports
Role-scoped reports
Imports
/imports
Excel migration

13.1 Protected API contract
Request
  ↓
JWT Authentication
  ↓
Permission / Role Check
  ↓
Determine Scope
  ├── SUPER_ADMIN → global
  ├── MANAGER     → team
  └── EXECUTIVE   → own records
  ↓
Scope-aware database query
  ↓
Business operation
Never rely on a frontend route guard alone. Do not retrieve arbitrary records solely by ID without applying the caller's scope.
14. SEARCH & REPORTING
Customer search: membership ID, customer name, phone, email, executive, manager, plan and membership status.
Reports must respect the same RBAC scope as operational screens.
Use PostgreSQL queries for the MVP.
Use materialized views/aggregation tables only when performance requires them.
Paginate large lists.
Prevent N+1 query patterns.
15. FRONTEND SCREENS
Login
Role-specific dashboard
Leads list/detail/create/edit
Activities/follow-ups
Customers list/detail/create/edit
Customer timeline
Deals list/detail/create/edit/close
Packages and package versions
Membership detail/history
Entitlement balance and ledger
Bookings list/create/detail/cancel where approved
Payments/history
Refunds
Incentives
Restricted salary administration
Users
Teams
Reports
Excel Import
Documents
Restricted Audit Logs
16. SECURITY
JWT access/refresh token strategy.
Secure password hashing.
Backend RBAC and record-level authorization.
IDOR prevention.
DTO/input validation.
Parameterized/ORM database access.
XSS-safe output/rendering.
CSRF protection where applicable to the chosen auth architecture.
Rate limiting for authentication and sensitive endpoints.
Secure file upload validation/storage.
Strict access to salary and sensitive customer information.
Audit logs for critical business/security mutations.
Secure secrets/configuration.
PostgreSQL backups and recovery.
17. AUDIT & OBSERVABILITY
Audit actor/user.
Audit action.
Audit target entity and ID.
Audit timestamp.
Capture relevant metadata/before-after information where appropriate.
Structured application logs.
Request/correlation IDs.
API latency/error monitoring.
Database slow-query monitoring.
Queue/background-job failure monitoring.
Health checks.
18. ASYNC PROCESSING & CACHING
Background-job candidates: Excel imports, emails, large reports/exports, scheduled reminders and heavy calculations.
Cache candidates: package/master data, permissions/settings and dashboard aggregates when safe.
Never treat cached payment, entitlement or booking state as authoritative.
19. TESTING STRATEGY
Unit tests for business/domain rules.
Integration tests for database behavior.
API tests for validation and authorization.
E2E tests for critical workflows.
Transaction/concurrency tests.
RBAC/security tests.
19.1 Mandatory tests
Executive A accessing Executive B's lead → DENY.
Manager 1 accessing Manager 2's customer → DENY.
Manager accessing own team's customer → ALLOW.
Super Admin accessing any customer → ALLOW.
Unauthorized salary access → DENY.
Changing URL/API IDs to another user's record → DENY.
Duplicate booking request → rejected/idempotent.
Duplicate payment request → rejected/idempotent.
Concurrent bookings cannot over-consume entitlement.
Repeated deal-closure request cannot create duplicate membership/entitlement.
20. IMPLEMENTATION PHASES
Phase
Name
Scope
0
Project foundation
NestJS + React + PostgreSQL/Prisma setup, environment/config, common conventions, module skeleton, health check. No business features.
1
Database foundation
Prisma schema/migrations, users/roles/permissions/teams, audit foundation, indexes.
2
Authentication + RBAC
Login, tokens, guards, permission checks, team/ownership scope, IDOR prevention, security tests.
3
Users + teams
Super Admin user management, manager/team setup, executive assignment, activation/deactivation.
4
Leads + activities
Lead lifecycle, ownership, calls, follow-ups, notes.
5
Customers
Customer master, assignment, search/filtering, timeline.
6
Deals + payments
Deal lifecycle, payment history, pending amounts, atomic deal closure.
7
Packages
Package catalog and versioned price/validity/days/nights.
8
Memberships
Customer purchase instances, current/active membership and history.
9
Entitlements + ledger
Allocations, ledger transactions, balance and history.
10
Bookings
Booking workflow, entitlement validation, concurrency/locking, approved cancellation/release.
11
Refunds
Refund records/history and authorization.
12
Incentives + salaries
Configurable incentive framework and restricted salary records; final rules require client input.
13
Dashboards + reports
Role-scoped dashboards and reports.
14
Excel migration
Upload, staging, validation, normalization, deduplication, mapping, preview, approval, import, reconciliation.
15
Notifications + documents
Email workflows and document storage/metadata.
16
Hardening
Security, performance, indexes, audit, observability, backups, deployment readiness.
17
Full regression
Unit/integration/API/E2E/RBAC/concurrency and production acceptance.

21. AI AGENT EXECUTION PROTOCOL
For every phase:

1. Read this Master Architecture document.
2. Read the attached client PDF.
3. Inspect the current repository.
4. Identify affected files/modules.
5. State the implementation plan before editing.
6. Implement ONLY the requested phase.
7. Preserve all previous functionality.
8. Run lint / formatting / typecheck.
9. Run relevant tests.
10. Run production build.
11. Report changed files, migrations, APIs, tests and results.
12. Report CLIENT_CLARIFICATION_REQUIRED items.
13. STOP. Do not start the next phase automatically.
21.1 Standard prompt template
Implement Phase <N>: <PHASE NAME> of the Club Infication CRM.

Before coding:
- Read the Master Architecture document.
- Read the attached client requirements PDF.
- Inspect the current repository.

Rules:
- Implement ONLY this phase.
- Do not invent business rules.
- Do not redesign the architecture.
- Do not add unapproved roles.
- Do not weaken backend authorization.
- Do not break existing functionality.
- Mark ambiguity CLIENT_CLARIFICATION_REQUIRED.
- Explain planned changes before editing.
- Run lint, typecheck, tests and build.
- Report all changes and verification results.
22. CLIENT CLARIFICATIONS REQUIRED
Final incentive slabs/percentages and eligibility.
Refund/cancellation treatment in incentive calculations.
Exact entitlement rules for quarterly/split usage if those are real rules.
Whether extra days/nights are sold separately and how pricing is calculated.
Booking rules: advance notice, blackout periods, minimum/maximum stay, availability, cancellation, release and rebooking.
Whether transfers/gifts/splits/advances are supported and their conditions.
Payment statuses, methods, partial-payment rules and approvals.
Refund approval permissions/workflow.
Which fields Managers may edit versus view-only.
Which fields become immutable after deal closure.
Exact salary visibility and management permissions.
Whether customer email notification is mandatory and exact content/template.
Membership ID generation/uniqueness rules.
Exact Excel column mappings and data-quality rules once real files are supplied.
Retention/deletion requirements for old records and documents.
23. FEATURE PRIORITY
23.1 MUST HAVE
Authentication; three-role RBAC; team/ownership scope.
Users/teams.
Leads/activities.
Customers.
Deals/sales.
Packages/package versions.
Memberships.
Entitlements + ledger.
Bookings/usage.
Payments/pending.
Refunds.
Incentive framework.
Dashboards/reports.
Excel migration.
Audit/security.
23.2 SHOULD HAVE
Email notifications
Documents/object storage
Background jobs
Advanced search optimization
Dashboard aggregation optimization when required
23.3 FUTURE / ONLY WHEN JUSTIFIED
Heavy Redis caching
Horizontal scaling
PostgreSQL read replicas
Dedicated reporting warehouse
Dedicated search engine
Microservices
Kubernetes
Kafka/event streaming
24. FINAL ARCHITECTURE REVIEW
Can Manager 1 access Manager 2 data through any endpoint?
Can Executive A access Executive B data by changing IDs?
Can salary data leak through generic endpoints?
Can duplicate requests create duplicate payments/bookings/deals?
Can concurrent bookings over-consume entitlement?
Can entitlement history be reconstructed from the ledger?
Can a closed deal be safely retried?
Are critical financial/entitlement operations transactional?
Do reports respect RBAC?
Are indexes based on actual query patterns?
Can Excel imports be validated and reconciled?
Are critical mutations auditable?
Are unresolved business rules explicitly documented?
Has unnecessary infrastructure been avoided?
25. FINAL INSTRUCTION TO ANTIGRAVITY
Build this as a production business CRM, not a generic CRUD demo. The objective is to replace the company's Excel-based process with a centralized, secure and auditable system. Maintain clear boundaries between leads, customers, deals, packages, memberships, entitlements, bookings, payments, refunds, incentives and salaries. Keep backend-enforced RBAC and record-level scope in every phase. Never invent undocumented business rules. When a requirement is not confirmed, mark it CLIENT_CLARIFICATION_REQUIRED and stop before implementing that rule.
26. SOURCE BASIS
Prepared from the supplied Club Infication CRM Functional Requirements & Role Access PDF and the accompanying architecture-design brief. The functional source confirms the Excel replacement objective, three login roles, customer/membership/payment/usage/refund/incentive requirements, Excel migration, role-scoped dashboards and customer search. The architecture brief requires PostgreSQL as source of truth, modular-monolith design, backend RBAC, transactional deal/booking flows, entitlement ledger, Excel staging/reconciliation, security, observability, testing and phased implementation.
Club Infication CRM — Master Architecture Specification v1.0


