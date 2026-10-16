/**
 * Centralized Error Handling Service
 * Handles all application errors consistently
 */

import { FirebaseError } from 'firebase/app';

export enum ErrorCode {
  // Authentication Errors
  AUTH_PHONE_INVALID = 'AUTH_PHONE_INVALID',
  AUTH_OTP_INVALID = 'AUTH_OTP_INVALID',
  AUTH_OTP_SEND_FAILED = 'AUTH_OTP_SEND_FAILED',
  AUTH_RECAPTCHA_DISABLED = 'AUTH_RECAPTCHA_DISABLED',
  AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
  
  // Firestore Errors
  FIRESTORE_PERMISSION_DENIED = 'FIRESTORE_PERMISSION_DENIED',
  FIRESTORE_NOT_FOUND = 'FIRESTORE_NOT_FOUND',
  FIRESTORE_WRITE_FAILED = 'FIRESTORE_WRITE_FAILED',
  FIRESTORE_READ_FAILED = 'FIRESTORE_READ_FAILED',
  
  // Medicine Errors
  MEDICINE_INVALID_DATA = 'MEDICINE_INVALID_DATA',
  MEDICINE_SAVE_FAILED = 'MEDICINE_SAVE_FAILED',
  MEDICINE_UPDATE_FAILED = 'MEDICINE_UPDATE_FAILED',
  
  // Network Errors
  NETWORK_OFFLINE = 'NETWORK_OFFLINE',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  
  // Generic Errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

/**
 * Application Error with consistent structure
 */
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public details?: unknown,
    public userMessage?: string
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Error Handler Service
 * Maps Firebase errors and external errors to consistent app errors
 */
export class ErrorHandler {
  /**
   * Handle Firebase errors
   */
  static handleFirebaseError(error: unknown): AppError {
    if (!(error instanceof FirebaseError)) {
      return this.handleUnknownError(error);
    }

    switch (error.code) {
      case 'auth/invalid-phone-number':
        return new AppError(
          ErrorCode.AUTH_PHONE_INVALID,
          'Invalid phone number format',
          error,
          'Please enter a valid 10-digit phone number'
        );

      case 'auth/invalid-verification-code':
        return new AppError(
          ErrorCode.AUTH_OTP_INVALID,
          'Invalid OTP verification code',
          error,
          'The OTP you entered is incorrect or has expired'
        );

      case 'auth/too-many-requests':
        return new AppError(
          ErrorCode.AUTH_OTP_SEND_FAILED,
          'Too many OTP requests',
          error,
          'Too many attempts. Please try again later'
        );

      case 'auth/operation-not-allowed':
        return new AppError(
          ErrorCode.AUTH_RECAPTCHA_DISABLED,
          'Phone authentication not enabled',
          error,
          'Authentication service is temporarily unavailable. Please try again later'
        );

      case 'permission-denied':
        return new AppError(
          ErrorCode.FIRESTORE_PERMISSION_DENIED,
          'Firestore permission denied',
          error,
          'You do not have permission to access this data'
        );

      case 'not-found':
        return new AppError(
          ErrorCode.FIRESTORE_NOT_FOUND,
          'Resource not found',
          error,
          'The requested data was not found'
        );

      case 'failed-precondition':
      case 'aborted':
        return new AppError(
          ErrorCode.FIRESTORE_WRITE_FAILED,
          'Firestore write failed',
          error,
          'Could not save your data. Please try again'
        );

      case 'unavailable':
        return new AppError(
          ErrorCode.NETWORK_ERROR,
          'Firestore service unavailable',
          error,
          'Service is temporarily unavailable. Please check your connection'
        );

      case 'unauthenticated':
        return new AppError(
          ErrorCode.AUTH_SESSION_EXPIRED,
          'Authentication session expired',
          error,
          'Your session has expired. Please sign in again'
        );

      default:
        return new AppError(
          ErrorCode.UNKNOWN_ERROR,
          `Firebase error: ${error.code}`,
          error,
          'An unexpected error occurred. Please try again'
        );
    }
  }

  /**
   * Handle network errors
   */
  static handleNetworkError(error: unknown): AppError {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new AppError(
        ErrorCode.NETWORK_ERROR,
        'Network request failed',
        error,
        'Please check your internet connection and try again'
      );
    }

    return this.handleUnknownError(error);
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(message: string, details?: unknown): AppError {
    return new AppError(
      ErrorCode.VALIDATION_ERROR,
      `Validation failed: ${message}`,
      details,
      message
    );
  }

  /**
   * Handle unknown/unexpected errors
   */
  static handleUnknownError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    const message =
      error instanceof Error ? error.message : String(error);

    console.error('[ErrorHandler] Unknown error caught:', error);

    return new AppError(
      ErrorCode.UNKNOWN_ERROR,
      `Unexpected error: ${message}`,
      error,
      'Something went wrong. Please try again'
    );
  }

  /**
   * Check if error is offline
   */
  static isOfflineError(error: AppError): boolean {
    return error.code === ErrorCode.NETWORK_OFFLINE ||
           error.code === ErrorCode.NETWORK_ERROR;
  }

  /**
   * Check if error is auth-related
   */
  static isAuthError(error: AppError): boolean {
    return error.code.startsWith('AUTH_');
  }

  /**
   * Check if error is recoverable
   */
  static isRecoverableError(error: AppError): boolean {
    const nonRecoverable = [
      ErrorCode.AUTH_RECAPTCHA_DISABLED,
      ErrorCode.FIRESTORE_PERMISSION_DENIED,
    ];
    return !nonRecoverable.includes(error.code);
  }

  /**
   * Log error for debugging
   */
  static logError(error: AppError, context?: string): void {
    const timestamp = new Date().toISOString();
    const prefix = context ? `[${context}]` : '';

    console.error(
      `${prefix} [${timestamp}] ${error.code}: ${error.message}`,
      error.details
    );
  }
}

export default ErrorHandler;
