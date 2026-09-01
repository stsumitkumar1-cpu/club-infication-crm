import { Injectable, Logger } from '@nestjs/common';
import { env, isProduction } from '../config/env.js';

export interface EmailMessage {
  to: string;
  subject: string;
  body: string;
}

export interface NewCustomerContext {
  customerName: string;
  customerEmail: string;
  plan: string;
  amount: number;
  amountPaid: number;
  pendingAmount: number;
  validity?: string | null;
  totalDays?: number;
  totalNights?: number;
  membershipId?: string | null;
}

/**
 * Email workflows — Master Spec 14, Phase 10.
 *
 * CLIENT_CLARIFICATION_REQUIRED (Spec 22 #7): §14 says the system *can*
 * automatically email a new customer, and asks two unanswered questions — is it
 * mandatory, and what is the exact content/template? So:
 *
 *   - Sending is OFF unless NOTIFICATIONS_ENABLED=true. Silently emailing real
 *     customers from a half-specified template would be worse than not sending.
 *   - No SMTP transport is wired. Adding one is a single `send()` swap; the
 *     call sites, template and enable/disable behaviour are all in place.
 *   - The draft template below is a placeholder and is marked as such.
 *
 * Delivery is deliberately fire-and-forget: a customer must still be created
 * successfully if the mail server is down (§8.1 does not list notification as
 * a step in the transaction).
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  /** Off unless explicitly switched on, pending the client's answer to #7. */
  private get enabled(): boolean {
    return process.env.NOTIFICATIONS_ENABLED === 'true';
  }

  private money(value: number): string {
    return `₹${value.toLocaleString('en-IN')}`;
  }

  /**
   * DRAFT template — the client has not supplied wording (Spec 22 #7).
   * Deliberately factual rather than marketing copy, so nothing is promised
   * on Club Infication's behalf.
   */
  buildNewCustomerEmail(ctx: NewCustomerContext): EmailMessage {
    const lines = [
      `Dear ${ctx.customerName},`,
      '',
      'Thank you for joining Club Infication. Your membership details are below.',
      '',
      `Plan: ${ctx.plan}`,
      ctx.membershipId ? `Membership ID: ${ctx.membershipId}` : null,
      ctx.validity ? `Validity: ${ctx.validity}` : null,
      ctx.totalDays || ctx.totalNights
        ? `Included: ${ctx.totalDays ?? 0} days / ${ctx.totalNights ?? 0} nights`
        : null,
      '',
      `Plan amount: ${this.money(ctx.amount)}`,
      `Amount received: ${this.money(ctx.amountPaid)}`,
      ctx.pendingAmount > 0
        ? `Balance pending: ${this.money(ctx.pendingAmount)}`
        : 'Your plan is fully paid.',
      '',
      'Please contact your Club Infication representative with any questions.',
      '',
      'Club Infication',
    ];

    return {
      to: ctx.customerEmail,
      subject: `Welcome to Club Infication — your ${ctx.plan} membership`,
      body: lines.filter((l) => l !== null).join('\n'),
    };
  }

  /**
   * Hands a message to the transport. With none configured it logs what would
   * have been sent, which is enough to review templates and call sites without
   * risking real delivery.
   */
  async send(message: EmailMessage): Promise<{ sent: boolean; reason?: string }> {
    if (!this.enabled) {
      this.logger.log(
        `[notifications disabled] would email ${message.to}: "${message.subject}"`,
      );
      return {
        sent: false,
        reason:
          'Notifications are disabled. Set NOTIFICATIONS_ENABLED=true once the client confirms the template (Spec 22 #7).',
      };
    }

    // TODO(Phase 10): wire a real transport once #7 is answered.
    // Intentionally not sending: there is no configured SMTP provider, and
    // guessing one would either fail at runtime or mail real customers from an
    // unapproved template.
    this.logger.warn(
      `Notifications are enabled but no transport is configured; ${message.to} was not emailed.`,
    );
    return {
      sent: false,
      reason: 'No email transport configured.',
    };
  }

  /**
   * Called after a customer is created. Never throws — a failed or skipped
   * email must not undo a saved customer.
   */
  async notifyNewCustomer(
    ctx: NewCustomerContext,
  ): Promise<{ sent: boolean; reason?: string }> {
    if (!ctx.customerEmail) {
      return { sent: false, reason: 'Customer has no email address on record.' };
    }

    try {
      return await this.send(this.buildNewCustomerEmail(ctx));
    } catch (error) {
      this.logger.error(
        `Failed to notify ${ctx.customerEmail}`,
        error instanceof Error ? error.stack : undefined,
      );
      return { sent: false, reason: 'Delivery failed; see the server log.' };
    }
  }

  /** Surfaced on the health/status side so the setting is not invisible. */
  getStatus() {
    return {
      enabled: this.enabled,
      transportConfigured: false,
      environment: env.nodeEnv,
      note: isProduction
        ? 'Configure a transport before enabling in production.'
        : 'Development: messages are logged, never delivered.',
      pendingClarification:
        'Spec 22 #7 — is the customer email mandatory, and what is the exact template?',
    };
  }
}
