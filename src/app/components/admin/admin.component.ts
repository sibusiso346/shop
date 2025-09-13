import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../services/car.service';
import { Vehicle, VehicleCategory } from '../../models/car.model';

export interface PhotoReview {
  id: string;
  vehicleId: string;
  category: string;
  photoUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  vehicle: Vehicle;
}

export interface VehicleReview {
  vehicle: Vehicle;
  photos: PhotoReview[];
  overallStatus: 'pending' | 'approved' | 'rejected' | 'partial';
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalPhotos: number;
  lastUpdated: Date;
}

export interface AdminStats {
  totalVehicles: number;
  pendingApproval: number;
  approvedToday: number;
  rejectedToday: number;
  totalPhotos: number;
  pendingPhotos: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  vehicles: Vehicle[] = [];
  photoReviews: PhotoReview[] = [];
  vehicleReviews: VehicleReview[] = [];
  filteredVehicles: VehicleReview[] = [];
  adminStats: AdminStats = {
    totalVehicles: 0,
    pendingApproval: 0,
    approvedToday: 0,
    rejectedToday: 0,
    totalPhotos: 0,
    pendingPhotos: 0
  };

  // Filters
  statusFilter: string = 'all';
  categoryFilter: string = 'all';
  searchTerm: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  // UI State
  selectedVehicle: VehicleReview | null = null;
  selectedPhoto: PhotoReview | null = null;
  showRejectionModal = false;
  rejectionReason = '';
  isProcessing = false;
  showPhotosModal = false;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.loadVehicles();
    this.generatePhotoReviews();
    this.generateVehicleReviews();
    this.calculateStats();
    this.applyFilters();
  }

  private loadVehicles() {
    this.vehicles = this.vehicleService.getVehicles()();
  }

  private generatePhotoReviews() {
    // Generate photo reviews from vehicles with images
    this.photoReviews = [];
    
    this.vehicles.forEach(vehicle => {
      if (vehicle.images && vehicle.images.length > 0) {
        vehicle.images.forEach((imageUrl, index) => {
          const photoReview: PhotoReview = {
            id: `${vehicle.id}-photo-${index}`,
            vehicleId: vehicle.id,
            category: this.getPhotoCategory(index),
            photoUrl: imageUrl,
            status: this.getRandomStatus(),
            uploadedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
            vehicle: vehicle
          };
          
          if (photoReview.status !== 'pending') {
            photoReview.reviewedAt = new Date(photoReview.uploadedAt.getTime() + Math.random() * 24 * 60 * 60 * 1000);
            photoReview.reviewedBy = 'Admin User';
            
            if (photoReview.status === 'rejected') {
              photoReview.rejectionReason = this.getRandomRejectionReason();
            }
          }
          
          this.photoReviews.push(photoReview);
        });
      }
    });
  }

  private generateVehicleReviews() {
    this.vehicleReviews = [];
    
    this.vehicles.forEach(vehicle => {
      const vehiclePhotos = this.photoReviews.filter(photo => photo.vehicleId === vehicle.id);
      
      if (vehiclePhotos.length > 0) {
        const pendingCount = vehiclePhotos.filter(p => p.status === 'pending').length;
        const approvedCount = vehiclePhotos.filter(p => p.status === 'approved').length;
        const rejectedCount = vehiclePhotos.filter(p => p.status === 'rejected').length;
        
        let overallStatus: 'pending' | 'approved' | 'rejected' | 'partial';
        if (pendingCount === vehiclePhotos.length) {
          overallStatus = 'pending';
        } else if (approvedCount === vehiclePhotos.length) {
          overallStatus = 'approved';
        } else if (rejectedCount === vehiclePhotos.length) {
          overallStatus = 'rejected';
        } else {
          overallStatus = 'partial';
        }
        
        const vehicleReview: VehicleReview = {
          vehicle: vehicle,
          photos: vehiclePhotos,
          overallStatus: overallStatus,
          pendingCount: pendingCount,
          approvedCount: approvedCount,
          rejectedCount: rejectedCount,
          totalPhotos: vehiclePhotos.length,
          lastUpdated: new Date(Math.max(...vehiclePhotos.map(p => p.uploadedAt.getTime())))
        };
        
        this.vehicleReviews.push(vehicleReview);
      }
    });
  }

  private getPhotoCategory(index: number): string {
    const categories = ['front', 'left', 'right', 'back', 'engine', 'dashboard'];
    return categories[index] || 'other';
  }

  private getRandomStatus(): 'pending' | 'approved' | 'rejected' {
    const statuses = ['pending', 'approved', 'rejected'];
    const weights = [0.3, 0.6, 0.1]; // 30% pending, 60% approved, 10% rejected
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < statuses.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return statuses[i] as 'pending' | 'approved' | 'rejected';
      }
    }
    
    return 'pending';
  }

  private getRandomRejectionReason(): string {
    const reasons = [
      'Poor image quality',
      'Inappropriate content',
      'Not a vehicle photo',
      'Blurry or unclear',
      'Wrong angle',
      'Contains personal information',
      'Duplicate image',
      'Too dark or overexposed'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  private calculateStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    this.adminStats = {
      totalVehicles: this.vehicles.length,
      pendingApproval: this.photoReviews.filter(p => p.status === 'pending').length,
      approvedToday: this.photoReviews.filter(p => 
        p.status === 'approved' && 
        p.reviewedAt && 
        p.reviewedAt >= today
      ).length,
      rejectedToday: this.photoReviews.filter(p => 
        p.status === 'rejected' && 
        p.reviewedAt && 
        p.reviewedAt >= today
      ).length,
      totalPhotos: this.photoReviews.length,
      pendingPhotos: this.photoReviews.filter(p => p.status === 'pending').length
    };
  }

  applyFilters() {
    let filtered = [...this.vehicleReviews];

    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.overallStatus === this.statusFilter);
    }

    // Category filter
    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.vehicle.category === this.categoryFilter);
    }

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(vehicle => 
        vehicle.vehicle.make.toLowerCase().includes(term) ||
        vehicle.vehicle.model.toLowerCase().includes(term) ||
        vehicle.vehicle.sellerName.toLowerCase().includes(term)
      );
    }

    this.filteredVehicles = filtered;
    this.currentPage = 1;
    this.calculatePagination();
  }

  private calculatePagination() {
    this.totalPages = Math.ceil(this.filteredVehicles.length / this.itemsPerPage);
  }

  getPaginatedVehicles(): VehicleReview[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredVehicles.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  selectVehicle(vehicle: VehicleReview) {
    this.selectedVehicle = vehicle;
    this.showPhotosModal = true;
  }

  selectPhoto(photo: PhotoReview) {
    this.selectedPhoto = photo;
  }

  closePhotosModal() {
    this.showPhotosModal = false;
    this.selectedVehicle = null;
    this.selectedPhoto = null;
  }

  approvePhoto(photo: PhotoReview) {
    this.isProcessing = true;
    
    // Simulate API call
    setTimeout(() => {
      photo.status = 'approved';
      photo.reviewedAt = new Date();
      photo.reviewedBy = 'Current Admin';
      photo.rejectionReason = undefined;
      
      this.generateVehicleReviews();
      this.calculateStats();
      this.applyFilters();
      this.isProcessing = false;
    }, 500);
  }

  rejectPhoto(photo: PhotoReview) {
    this.selectedPhoto = photo;
    this.showRejectionModal = true;
    this.rejectionReason = '';
  }

  confirmRejection() {
    if (!this.selectedPhoto || !this.rejectionReason.trim()) return;
    
    this.isProcessing = true;
    
    // Simulate API call
    setTimeout(() => {
      this.selectedPhoto!.status = 'rejected';
      this.selectedPhoto!.reviewedAt = new Date();
      this.selectedPhoto!.reviewedBy = 'Current Admin';
      this.selectedPhoto!.rejectionReason = this.rejectionReason;
      
      this.generateVehicleReviews();
      this.calculateStats();
      this.applyFilters();
      this.isProcessing = false;
      this.showRejectionModal = false;
      this.selectedPhoto = null;
      this.rejectionReason = '';
    }, 500);
  }

  cancelRejection() {
    this.showRejectionModal = false;
    this.selectedPhoto = null;
    this.rejectionReason = '';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'pending': return 'status-pending';
      case 'partial': return 'status-partial';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'approved': return 'check-circle';
      case 'rejected': return 'x-circle';
      case 'pending': return 'clock';
      case 'partial': return 'alert-circle';
      default: return 'help-circle';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'front': return 'car';
      case 'left': return 'arrow-left';
      case 'right': return 'arrow-right';
      case 'back': return 'arrow-down';
      case 'engine': return 'settings';
      case 'dashboard': return 'monitor';
      default: return 'image';
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  }

  // Expose Math to template
  Math = Math;
}
