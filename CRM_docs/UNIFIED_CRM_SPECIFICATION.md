# UNIFIED CRM SPECIFICATION: CLUB INFICATION

**Version:** 1.0 (Combined Requirements & Architecture)
**Tech Stack:** NestJS + React + PostgreSQL | Modular Monolith

This document is the final, unified specification combining the Functional Requirements and the Technical Architecture. It serves as the definitive guide for implementation.

## 1. SYSTEM OVERVIEW
Club Infication requires a centralized CRM to replace their Excel-based operations. The CRM will manage customers, plans, payments, holiday usage, refunds, sales tracking, and executive incentives. Customers do not log into the CRM.

**Customer Intake Flow (New & Manual):**
1. **Web Form:** Customers can come from a web form. The form submission will directly create a Customer record in the CRM.
2. **Manual Entry:** Super Admins, Managers, or Executives can manually add customer details into the system.

## 2. USER ROLES & RBAC (Role-Based Access Control)
The CRM strictly enforces three backend roles:
*   **SUPER_ADMIN:** Global access. Can view/manage all customers, teams, payments, refunds, and configure incentive rules.
*   **MANAGER:** Team scope. Can view/manage only the Executives assigned to them, and the customers/sales/payments belonging to their team.
*   **EXECUTIVE:** Own-record scope. Can add and manage their own assigned customers, view their own sales, and track their incentives.

## 3. CORE DOMAIN MODULES & DATABASE ENTITIES

The architecture will map the business requirements into the following primary PostgreSQL tables (Source of Truth):

### A. Customers & Memberships (The "Customers Table")
As requested, customer data and their purchased plan are the core of the system.
*   `customer_id` (Primary Key)
*   `name`
*   `phone_number`
*   `email`
*   `plan` (e.g., Bronze, Silver, Gold, Custom)
*   `amount` (Total plan amount)
*   `amount_paid`
*   `pending_amount`
*   `membership_validity` (e.g., 5 Years)
*   `assigned_executive_id` / `assigned_manager_id`
*   `status` (Active, Pending, Cancelled)

*(Note: In the backend database, this may be logically normalized into `Customers` and `Memberships/Packages` for scaling, but presented seamlessly in the API and UI).*

### B. Entitlements & Usage Ledger
Instead of just a static "remaining days" number, the CRM will track usage via an auditable ledger:
*   **Total Included:** Days and Nights allocated by the plan.
*   **Bookings/Usage:** Deducts days/nights when a holiday is booked.
*   **Remaining Balance:** Dynamically calculated based on total minus used.

### C. Payments & Refunds
*   **Payments Table:** Tracks each payment installment, date, and amount.
*   **Refunds Table:** Tracks refund amount, date, reason, and approving manager/admin.

### D. Executive Incentives
*   Calculates incentives based on the Executive's eligible sales amount.
*   Supports configurable rules (slabs) provided by Club Infication.
*   Handles deductions if a refund or cancellation occurs.

### E. Excel Import (Migration)
*   Upload legacy `.xls/.xlsx` files.
*   Map and import historical data (previous plans, active plans, used/remaining days).
*   Maintain legacy validity and payment statuses.

## 4. API & SYSTEM ARCHITECTURE
*   **Framework:** NestJS (Backend), React (Frontend).
*   **Database:** PostgreSQL (with Prisma ORM).
*   **Security:** JWT Authentication. Every API endpoint must verify the token AND enforce the RBAC scope (e.g., An Executive cannot fetch another Executive's customer ID).
*   **Transactions:** Critical operations (like recording a payment, booking a holiday, or issuing a refund) must be wrapped in PostgreSQL Database Transactions to prevent data corruption.
*   **Email Notifications:** When a new customer is added (via form or manually), the system automatically sends a welcome email with membership details.

## 5. DASHBOARDS
*   **Super Admin Dashboard:** Total customers, new customers (from form/manual), total sales, pending payments, active memberships, company-wide incentives.
*   **Manager Dashboard:** Team sales, team customer usage, pending payments, team incentives.
*   **Executive Dashboard:** Own customers, personal sales, personal pending amounts, own incentives.

## 6. EXCLUDED / DROPPED FEATURES
Based on the functional requirements, the following complex architectural elements have been removed to keep the system simple and focused:
*   ~~Pre-sales CRM Pipeline (Leads -> Activities -> Deals)~~. *Replaced by direct Customer Form & Manual Entry.*
*   ~~Employee Salaries Module.~~ *Only Sales Incentives will be tracked.*
*   ~~Heavy Microservices / Kubernetes.~~ *A straightforward Modular Monolith is confirmed.*
*   ~~Redis.~~ *Removed to simplify architecture; PostgreSQL will handle all state and asynchronous jobs.*

## 7. IMPLEMENTATION PHASES (Revised)
| Phase | Name | Scope |
| :--- | :--- | :--- |
| **0** | **Project foundation** | NestJS + React + PostgreSQL/Prisma setup, environment/config, module skeleton, health check. |
| **1** | **Database foundation & Auth** | Prisma schema/migrations. Login, JWT tokens, guards, RBAC roles (Super Admin, Manager, Executive). |
| **2** | **Users & Teams** | Super Admin user management, manager/team setup, executive assignment. |
| **3** | **Customers & Intake** | Customer schema (ID, name, phone, email, plan, amount). Web form intake API, manual creation by staff, filtering. |
| **4** | **Payments & Refunds** | Payment history, pending amounts tracking, refund records and logic. |
| **5** | **Entitlements & Bookings** | Days/Nights Ledger (allocations, usage tracking). Holiday booking workflow, entitlement validation. |
| **6** | **Incentives** | Configurable incentive rules based on Executive eligible sales amounts. |
| **7** | **Dashboards & Reports** | Role-scoped dashboards (Super Admin vs Manager vs Exec). |
| **8** | **Excel Migration** | Legacy data upload, validation, mapping, and import of legacy customer files. |
| **9** | **Notifications & Hardening** | Email workflows for new customers, final security checks, and testing. |
