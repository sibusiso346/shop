import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './terms-of-service.component.html',
  styleUrl: './terms-of-service.component.css'
})
export class TermsOfServiceComponent {
  lastUpdated = 'December 12, 2024';
}
