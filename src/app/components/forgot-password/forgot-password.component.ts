import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  isEmailSent = false;

  constructor(private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email address';
      this.isLoading = false;
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      this.isLoading = false;
      return;
    }

    // Simulate password reset process
    setTimeout(() => {
      this.isLoading = false;
      this.isEmailSent = true;
      this.successMessage = `Password reset instructions have been sent to ${this.email}`;
    }, 2000);
  }

  onResendEmail() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = `Password reset instructions have been resent to ${this.email}`;
    }, 1500);
  }

  onBackToLogin() {
    this.router.navigate(['/login']);
  }

  onTryDifferentEmail() {
    this.isEmailSent = false;
    this.email = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
