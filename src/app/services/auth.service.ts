import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  // Sample users for demo purposes
  private users: User[] = [
    {
      id: '1',
      email: 'john@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Smith',
      phone: '+1-555-0123',
      location: 'New York, NY',
      dateJoined: new Date('2024-01-15'),
      isActive: true
    },
    {
      id: '2',
      email: 'sarah@example.com',
      password: 'password123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1-555-0456',
      location: 'Los Angeles, CA',
      dateJoined: new Date('2024-01-20'),
      isActive: true
    },
    {
      id: '3',
      email: 'mike@example.com',
      password: 'password123',
      firstName: 'Mike',
      lastName: 'Chen',
      phone: '+1-555-0789',
      location: 'San Francisco, CA',
      dateJoined: new Date('2024-01-25'),
      isActive: true
    }
  ];

  constructor(private router: Router) {
    // Check if user is already logged in (from localStorage)
    this.checkStoredAuth();
  }

  login(credentials: LoginCredentials): boolean {
    const user = this.users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password &&
      u.isActive
    );

    if (user) {
      // Remove password from stored user object
      const { password, ...userWithoutPassword } = user;
      this.currentUser.set(userWithoutPassword as User);
      this.isAuthenticated.set(true);
      
      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      localStorage.setItem('isAuthenticated', 'true');
      
      return true;
    }
    
    return false;
  }

  register(userData: RegisterData): boolean {
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: this.generateId(),
      ...userData,
      dateJoined: new Date(),
      isActive: true
    };

    this.users.push(newUser);
    return true;
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/']);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getFullName(): string {
    const user = this.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  private checkStoredAuth(): void {
    const storedUser = localStorage.getItem('currentUser');
    const storedAuth = localStorage.getItem('isAuthenticated');
    
    if (storedUser && storedAuth === 'true') {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
