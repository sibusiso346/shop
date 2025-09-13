import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclePhotosComponent } from './vehicle-photos.component';

@Component({
  selector: 'app-vehicle-photos-test',
  standalone: true,
  imports: [CommonModule, VehiclePhotosComponent],
  template: `
    <div class="test-container">
      <h1>Vehicle Photos Component Test</h1>
      <p>This is a test page for the vehicle photos component.</p>
      
      <app-vehicle-photos
        [maxPhotos]="10"
        [existingPhotos]="[]"
        (photosChange)="onPhotosChange($event)"
        (photosAdded)="onPhotosAdded($event)"
      ></app-vehicle-photos>
      
      <div class="test-info">
        <h3>Test Information:</h3>
        <p><strong>Photos Count:</strong> {{ photosCount }}</p>
        <p><strong>Photo URLs:</strong></p>
        <ul>
          <li *ngFor="let url of photoUrls">{{ url }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .test-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .test-info {
      margin-top: 2rem;
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 8px;
    }
    
    .test-info h3 {
      margin-top: 0;
    }
    
    .test-info ul {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
    }
    
    .test-info li {
      margin: 0.25rem 0;
      word-break: break-all;
    }
  `]
})
export class VehiclePhotosTestComponent {
  photosCount = 0;
  photoUrls: string[] = [];

  onPhotosChange(photos: string[]) {
    this.photoUrls = photos;
    this.photosCount = photos.length;
  }

  onPhotosAdded(uploads: any[]) {
    console.log('Photos added:', uploads);
  }
}
