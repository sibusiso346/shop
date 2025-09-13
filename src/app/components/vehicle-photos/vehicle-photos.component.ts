import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PhotoUpload {
  id: string;
  file: File;
  preview: string;
  isUploading: boolean;
  isUploaded: boolean;
  url?: string;
  error?: string;
}

export interface VehiclePhotoCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  photo?: PhotoUpload;
  placeholder: string;
}

@Component({
  selector: 'app-vehicle-photos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-photos.component.html',
  styleUrl: './vehicle-photos.component.css'
})
export class VehiclePhotosComponent implements OnInit {
  @Input() maxPhotos: number = 10;
  @Input() existingPhotos: string[] = [];
  @Output() photosChange = new EventEmitter<string[]>();
  @Output() photosAdded = new EventEmitter<PhotoUpload[]>();

  photoCategories: VehiclePhotoCategory[] = [
    {
      id: 'front',
      name: 'Front View',
      description: 'Front view of the vehicle',
      required: true,
      placeholder: 'Upload front view photo'
    },
    {
      id: 'left',
      name: 'Left Side',
      description: 'Left side profile of the vehicle',
      required: true,
      placeholder: 'Upload left side photo'
    },
    {
      id: 'right',
      name: 'Right Side',
      description: 'Right side profile of the vehicle',
      required: true,
      placeholder: 'Upload right side photo'
    },
    {
      id: 'back',
      name: 'Rear View',
      description: 'Rear view of the vehicle',
      required: true,
      placeholder: 'Upload rear view photo'
    },
    {
      id: 'engine',
      name: 'Engine Bay',
      description: 'Engine compartment',
      required: false,
      placeholder: 'Upload engine bay photo'
    },
    {
      id: 'dashboard',
      name: 'Dashboard',
      description: 'Interior dashboard view',
      required: false,
      placeholder: 'Upload dashboard photo'
    }
  ];

  isDragOver = false;
  uploadProgress: { [key: string]: number } = {};
  draggedCategory: string | null = null;

  ngOnInit() {
    // Initialize photo categories with existing photos if any
    if (this.existingPhotos.length > 0) {
      this.existingPhotos.forEach((url, index) => {
        if (index < this.photoCategories.length) {
          this.photoCategories[index].photo = {
            id: `existing-${index}`,
            file: null as any,
            preview: url,
            isUploading: false,
            isUploaded: true,
            url: url
          };
        }
      });
    }
  }

  onFileSelected(event: Event, categoryId: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0], categoryId);
    }
  }

  onDragOver(event: DragEvent, categoryId: string) {
    event.preventDefault();
    this.draggedCategory = categoryId;
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.draggedCategory = null;
    this.isDragOver = false;
  }

  onDrop(event: DragEvent, categoryId: string) {
    event.preventDefault();
    this.isDragOver = false;
    this.draggedCategory = null;
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.handleFile(event.dataTransfer.files[0], categoryId);
    }
  }

  private handleFile(file: File, categoryId: string) {
    if (!file.type.startsWith('image/')) {
      alert('Please select only image files.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert(`File ${file.name} is too large. Maximum size is 10MB.`);
      return;
    }

    const category = this.photoCategories.find(cat => cat.id === categoryId);
    if (!category) return;

    const photo: PhotoUpload = {
      id: this.generateId(),
      file: file,
      preview: '',
      isUploading: false,
      isUploaded: false
    };

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      photo.preview = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    category.photo = photo;
    this.emitPhotosChange();
  }

  removePhoto(categoryId: string) {
    const category = this.photoCategories.find(cat => cat.id === categoryId);
    if (category) {
      category.photo = undefined;
      this.emitPhotosChange();
    }
  }

  uploadPhoto(categoryId: string) {
    const category = this.photoCategories.find(cat => cat.id === categoryId);
    if (!category?.photo || category.photo.isUploading || category.photo.isUploaded) return;

    const photo = category.photo;
    photo.isUploading = true;
    this.uploadProgress[photo.id] = 0;

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      this.uploadProgress[photo.id] += Math.random() * 30;
      if (this.uploadProgress[photo.id] >= 100) {
        this.uploadProgress[photo.id] = 100;
        clearInterval(progressInterval);
        
        // Simulate successful upload
        setTimeout(() => {
          photo.isUploading = false;
          photo.isUploaded = true;
          photo.url = photo.preview; // In real app, this would be the server URL
          delete this.uploadProgress[photo.id];
          this.emitPhotosChange();
        }, 500);
      }
    }, 200);
  }

  uploadAllPhotos() {
    this.photoCategories.forEach(category => {
      if (category.photo && !category.photo.isUploaded && !category.photo.isUploading) {
        this.uploadPhoto(category.id);
      }
    });
  }

  private emitPhotosChange() {
    const photoUrls = this.photoCategories
      .filter(category => category.photo?.isUploaded)
      .map(category => category.photo!.url || category.photo!.preview);
    
    const allPhotos = this.photoCategories
      .filter(category => category.photo)
      .map(category => category.photo!);
    
    this.photosChange.emit(photoUrls);
    this.photosAdded.emit(allPhotos);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  get canAddMorePhotos(): boolean {
    return this.photoCategories.filter(cat => cat.photo).length < this.maxPhotos;
  }

  get hasUnuploadedPhotos(): boolean {
    return this.photoCategories.some(category => 
      category.photo && !category.photo.isUploaded && !category.photo.isUploading
    );
  }

  get requiredPhotosComplete(): boolean {
    return this.photoCategories
      .filter(cat => cat.required)
      .every(cat => cat.photo?.isUploaded);
  }

  get totalPhotos(): number {
    return this.photoCategories.filter(cat => cat.photo).length;
  }

  get uploadedPhotos(): PhotoUpload[] {
    return this.photoCategories
      .filter(category => category.photo?.isUploaded)
      .map(category => category.photo!);
  }

  getRequiredPhotosCount(): number {
    return this.photoCategories
      .filter(cat => cat.required && cat.photo?.isUploaded)
      .length;
  }

  getRequiredPhotosTotal(): number {
    return this.photoCategories
      .filter(cat => cat.required)
      .length;
  }
}
