const BASE_URL = '/api/authentication';

export interface LoginData {
  userName: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  roles: string[];
}

export interface UserDto {
  id: number;
  userName: string;
  roles: string[];
}

export const login = async (data: LoginData): Promise<UserDto> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
};

export const logout = async (): Promise<void> => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Logout failed');
  }
};

export const getCurrentUser = async (): Promise<UserDto | null> => {
  try {
    const response = await fetch(`${BASE_URL}/me`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch {
    return null;
  }
};

export const register = async (data: RegisterData): Promise<UserDto> => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  
  return response.json();
};