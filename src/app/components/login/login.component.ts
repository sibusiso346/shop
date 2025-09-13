import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials: LoginCredentials = {
    email: '',
    password: ''
  };

  errorMessage = '';
  isLoading = false;
  rememberMe = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please fill in all fields';
      this.isLoading = false;
      return;
    }

    const success = this.authService.login(this.credentials);
    
    if (success) {
      // Redirect to sell page after successful login
      this.router.navigate(['/sell']);
    } else {
      this.errorMessage = 'Invalid email or password';
    }
    
    this.isLoading = false;
  }

  onDemoLogin() {
    this.credentials = {
      email: 'john@example.com',
      password: 'password123'
    };
    this.onSubmit();
  }

  onGoogleLogin() {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Simulate Google login process
    setTimeout(() => {
      // In a real app, this would integrate with Google OAuth
      const googleUser = {
        email: 'user@gmail.com',
        firstName: 'Google',
        lastName: 'User',
        id: 'google_' + Date.now()
      };
      
      // Store user data in localStorage for demo
      localStorage.setItem('currentUser', JSON.stringify(googleUser));
      localStorage.setItem('isLoggedIn', 'true');
      
      this.isLoading = false;
      this.router.navigate(['/sell']);
    }, 1500);
  }

}
