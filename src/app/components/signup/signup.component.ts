import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  agreeToTerms: boolean;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: SignupForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false
  };

  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    // Validation
    if (!this.validateForm()) {
      this.isLoading = false;
      return;
    }

    // Simulate signup process
    setTimeout(() => {
      const newUser = {
        id: 'user_' + Date.now(),
        firstName: this.signupForm.firstName,
        lastName: this.signupForm.lastName,
        email: this.signupForm.email,
        phone: this.signupForm.phone,
        joinDate: new Date().toISOString()
      };

      // Store user data
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('isLoggedIn', 'true');

      this.isLoading = false;
      this.router.navigate(['/sell']);
    }, 1500);
  }

  onGoogleSignup() {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Simulate Google signup process
    setTimeout(() => {
      const googleUser = {
        id: 'google_' + Date.now(),
        firstName: 'Google',
        lastName: 'User',
        email: 'user@gmail.com',
        phone: '',
        joinDate: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(googleUser));
      localStorage.setItem('isLoggedIn', 'true');
      
      this.isLoading = false;
      this.router.navigate(['/sell']);
    }, 1500);
  }

  private validateForm(): boolean {
    if (!this.signupForm.firstName.trim()) {
      this.errorMessage = 'First name is required';
      return false;
    }

    if (!this.signupForm.lastName.trim()) {
      this.errorMessage = 'Last name is required';
      return false;
    }

    if (!this.signupForm.email.trim()) {
      this.errorMessage = 'Email is required';
      return false;
    }

    if (!this.isValidEmail(this.signupForm.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    if (!this.signupForm.password) {
      this.errorMessage = 'Password is required';
      return false;
    }

    if (this.signupForm.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }

    if (this.signupForm.password !== this.signupForm.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (!this.signupForm.agreeToTerms) {
      this.errorMessage = 'Please agree to the Terms of Service and Privacy Policy';
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
