// frontend/src/actions.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signUpAction } from './actions';

// Create a 'mockCreateUser' variable that is guaranteed to be
// initialized before the vi.mock factory below is executed.
const { mockCreateUser } = vi.hoisted(() => {
  return { mockCreateUser: vi.fn() };
});

// Mock factory can references the hoisted variable.
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      admin: {
        createUser: mockCreateUser,
      },
    },
  })),
}));

describe('signUpAction', () => {

  beforeEach(() => {
    // Reset hoisted mock before each test for isolation.
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
    expect(mockCreateUser).not.toHaveBeenCalled();
  });
});