/**
 * useContacts Hook
 * Manages family contacts subscription and operations
 */

import { useEffect, useCallback } from 'react';
import { useAppStore } from '../store/store';
import { subscribeToContacts } from '../repositories/contactsRepository';
import ContactService from '../services/contacts/contactService';
import { ErrorHandler, AppError } from '../services/errors/ErrorHandler';
import { FamilyContact } from '../types';
import { FEATURES } from '../config/environment';

/**
 * Contacts hook with subscriptions and operations
 */
export function useContacts(uid: string | undefined) {
  const {
    contacts,
    isContactsLoading,
    contactsError,
    setContacts,
    setContactsLoading,
    setContactsError,
  } = useAppStore();

  // Subscribe to contacts
  useEffect(() => {
    if (!uid) {
      setContacts([]);
      return;
    }

    if (!FEATURES.enableFirebase) {
      setContacts([]);
      setContactsLoading(false);
      setContactsError(null);
      return () => {};
    }

    setContactsLoading(true);

    const unsubscribe = subscribeToContacts(uid, (contactList) => {
      setContacts(contactList);
      setContactsLoading(false);
      setContactsError(null);
    });

    return () => {
      unsubscribe();
    };
  }, [uid, setContacts, setContactsLoading, setContactsError]);

  // Add contact
  const addContact = useCallback(
    async (contact: Omit<FamilyContact, 'id' | 'createdAt'>) => {
      try {
        setContactsError(null);
        const contactId = await ContactService.addContact(contact);
        return contactId;
      } catch (error) {
        const appError = error instanceof AppError
          ? error
          : ErrorHandler.handleUnknownError(error);

        setContactsError(appError.userMessage || appError.message);
        throw appError;
      }
    },
    [setContactsError]
  );

  // Update contact
  const updateContact = useCallback(
    async (contactId: string, updates: Partial<FamilyContact>) => {
      try {
        setContactsError(null);
        await ContactService.updateContact(contactId, updates);
      } catch (error) {
        const appError = error instanceof AppError
          ? error
          : ErrorHandler.handleUnknownError(error);

        setContactsError(appError.userMessage || appError.message);
        throw appError;
      }
    },
    [setContactsError]
  );

  // Delete contact
  const deleteContact = useCallback(
    async (contactId: string) => {
      try {
        setContactsError(null);
        await ContactService.deleteContact(contactId);
      } catch (error) {
        const appError = error instanceof AppError
          ? error
          : ErrorHandler.handleUnknownError(error);

        setContactsError(appError.userMessage || appError.message);
        throw appError;
      }
    },
    [setContactsError]
  );

  return {
    contacts,
    isLoading: isContactsLoading,
    error: contactsError,
    addContact,
    updateContact,
    deleteContact,
  };
}

export default useContacts;
