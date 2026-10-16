/**
 * Services Index
 * Centralized exports for all business logic services
 */

// Error handling
export { ErrorHandler, AppError, ErrorCode } from './errors/ErrorHandler';

// Auth service
export { AuthService } from './auth/authService';
export type { SendOTPResponse, VerifyOTPResponse } from './auth/authService';

// Medicines service
export { MedicineService } from './medicines/medicineService';

// Contacts service
export { ContactService } from './contacts/contactService';

export default {};
