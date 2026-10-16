/**
 * Contacts Business Logic Service
 * Handles family contact operations
 */

import {
  addContact as addContactRepo,
  updateContact as updateContactRepo,
  deleteContact as deleteContactRepo,
  recordContactAlert as recordContactAlertRepo,
} from '../../repositories/contactsRepository';
import { FamilyContact } from '../../types';
import { ErrorHandler, AppError } from '../errors/ErrorHandler';
import { FAMILY, AUTH } from '../../config/constants';

/**
 * Contacts Service
 * High-level contact operations
 */
export class ContactService {
  /**
   * Validate phone number format
   */
  static validatePhoneNumber(phone: string): boolean {
    return AUTH.PHONE_NUMBER.REGEX.test(phone);
  }

  /**
   * Validate contact data
   */
  static validateContactData(
    contact: Omit<FamilyContact, 'id' | 'createdAt'>
  ): boolean {
    if (!contact.name || contact.name.trim().length === 0) {
      throw ErrorHandler.handleValidationError('Contact name is required');
    }

    if (!this.validatePhoneNumber(contact.phone)) {
      throw ErrorHandler.handleValidationError(
        'Invalid phone number format (must be 10 digits)'
      );
    }

    if (!contact.role || contact.role.trim().length === 0) {
      throw ErrorHandler.handleValidationError('Contact role is required');
    }

    if (
      contact.alertLevel < FAMILY.ALERT_LEVELS.LOW ||
      contact.alertLevel > FAMILY.ALERT_LEVELS.HIGH
    ) {
      throw ErrorHandler.handleValidationError('Invalid alert level');
    }

    return true;
  }

  /**
   * Add new family contact
   */
  static async addContact(
    contact: Omit<FamilyContact, 'id' | 'createdAt'>
  ): Promise<string> {
    try {
      this.validateContactData(contact);
      return await addContactRepo(contact);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw ErrorHandler.handleFirebaseError(error);
    }
  }

  /**
   * Update family contact
   */
  static async updateContact(
    contactId: string,
    updates: Partial<FamilyContact>
  ): Promise<void> {
    try {
      if (updates.name && updates.name.trim().length === 0) {
        throw ErrorHandler.handleValidationError('Contact name cannot be empty');
      }

      if (updates.phone && !this.validatePhoneNumber(updates.phone)) {
        throw ErrorHandler.handleValidationError('Invalid phone number format');
      }

      await updateContactRepo(contactId, updates);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw ErrorHandler.handleFirebaseError(error);
    }
  }

  /**
   * Delete family contact
   */
  static async deleteContact(contactId: string): Promise<void> {
    try {
      await deleteContactRepo(contactId);
    } catch (error) {
      throw ErrorHandler.handleFirebaseError(error);
    }
  }

  /**
   * Record alert sent to contact
   */
  static async recordAlertSent(contactId: string): Promise<void> {
    try {
      await recordContactAlertRepo(contactId);
    } catch (error) {
      throw ErrorHandler.handleFirebaseError(error);
    }
  }

  /**
   * Get alert level display name
   */
  static getAlertLevelName(level: number): string {
    return FAMILY.ALERT_LEVEL_NAMES[level as keyof typeof FAMILY.ALERT_LEVEL_NAMES] || 'Unknown';
  }

  /**
   * Get contacts by alert level
   */
  static getContactsByAlertLevel(
    contacts: FamilyContact[],
    level: number
  ): FamilyContact[] {
    return contacts.filter((c) => c.alertLevel === level);
  }

  /**
   * Check if contacts should be alerted for missed dose
   */
  static shouldAlertContacts(fallbackStrategy: string | null): boolean {
    return fallbackStrategy === 'family';
  }
}

export default ContactService;
