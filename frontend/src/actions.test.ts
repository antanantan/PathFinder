import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signUpAction, loginAction } from './actions';
// To test the signUpAction function, we to stop it from making real API calls to Supabase.
// The dependency createClient from the supabase-js library needs to be mocked.
//
// The vi.hoisted utility creates a variable before any module import or code execution
// so that it can create a mock function (mockCreateUser) that can be referenced inside the vi.mock factory and directly in the tests
const { mockCreateUser, mockSignIn} = vi.hoisted(() => {
  return { mockCreateUser: vi.fn(),
           mockSignIn: vi.fn(),
   };
});

// Mock the entire supabase-js module to nitercept the createClient call and returns a mock client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      admin: {
        createUser: mockCreateUser,
      },
      signInWithPassword: mockSignIn, 
    },
  })),
}));

// --- Test Suite for signUpAction ---

describe('signUpAction', () => {

  beforeEach(() => {
    // Reset hoisted mock before each test for isolation.
    // clears both the call history and any mock implementations (e.g. mockResolvedValueOnce)
    mockCreateUser.mockReset();
  });

  it('should return success when sign-up is successful', async () => {
    // Arrange
    mockCreateUser.mockResolvedValueOnce({
      data: { user: { id: '123-abc', email: 'test@example.com' } },
      error: null,
    });
    
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');

    // Act
    const result = await signUpAction({ error: null, success: false }, formData);

    // Assert
    expect(result.error).toBeNull();
    expect(result.success).toBe(true);
    // Assert that the external dependency was called with the correct data
    expect(mockCreateUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123', email_confirm: true });
  });

  it('should return an error message if Supabase fails', async () => {
    // Arrange
    mockCreateUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'A user with this email address has already been registered' },
    });
    
    const formData = new FormData();
    formData.append('email', 'existing@example.com');
    formData.append('password', 'password123');

    // Act
    const result = await signUpAction({ error: null, success: false }, formData);
    
    // Assert
    expect(result.error).toBe('A user with this email address has already been registered');
  });

  it('should return a validation error for short passwords', async () => {
    // Arrange
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', '123');

    // Act
    const result = await signUpAction({ error: null, success: false }, formData);

    // Assert
    expect(result.error).toContain('Password must be at least 6 characters');
    // Assert that no API call was made with invalid data
    expect(mockCreateUser).not.toHaveBeenCalled();
  });
});


// --- Test Suite for loginAction --- 
describe('loginAction', () => {

  beforeEach(() => {
    // Reset the mock before each test for isolation
    mockSignIn.mockReset();
  });

  it('should return success when login is successful', async () => {
    // Arrange
    mockSignIn.mockResolvedValueOnce({ error: null });
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');

    // Act
    const result = await loginAction({ error: null }, formData);

    // Assert: On success, we expect no error and a success flag.
    expect(result.error).toBeNull();
    expect(result.success).toBe(true);
    expect(mockSignIn).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
  });

  it('should return an error message on a failed login', async () => {
    // Arrange
    mockSignIn.mockResolvedValueOnce({ 
      error: { message: 'Invalid login credentials.' } 
    });
    const formData = new FormData();
    formData.append('email', 'wrong@example.com');
    formData.append('password', 'wrongpassword');

    // Act
    const result = await loginAction({ error: null }, formData);

    // Assert
    expect(result.error).toBe('Invalid login credentials.');
    expect(result.success).toBeUndefined();
  });

  it('should return a validation error if email is missing', async () => {
     // Arrange
     const formData = new FormData();
     // No email is appended
     formData.append('password', 'password123');
 
     // Act
     const result = await loginAction({ error: null }, formData);
 
     // Assert
     expect(result.error).toBe('Email and password are required.');
     // Assert that we did not even attempt to call Supabase
     expect(mockSignIn).not.toHaveBeenCalled();
  });
});