import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationService } from '../../services/destination.service';
import { FormsModule } from '@angular/forms';
import { Destination } from '../../models/destination.model';

@Component({
  selector: 'app-destination-list',
   standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './destination-list.html',
  styleUrl: './destination-list.css'
})

export class DestinationList {
  destinations: Destination[] = [];
  filters = { countryCode: '', type: '' };
  page = 0;
  size = 10;
  hasMore = false;
  types = ['CITY', 'BEACH', 'MOUNTAIN', 'FOREST']; // Según tu enum

selectedDestination: Destination | null = null;

selectDestination(destination: Destination): void {
  this.selectedDestination = destination;
}

  constructor(private destinationService: DestinationService) {
    this.loadDestinations();
  }

  loadDestinations(): void {
    this.destinationService.getDestinations(this.page, this.size, this.filters).subscribe(response => {
      this.destinations = response.content;
      this.hasMore = !response.last;
    });
  }

  applyFilters(): void {
    this.page = 0;
    this.loadDestinations();
  }

  openCreateForm(): void {
  // De momento puedes usar prompt, o luego abrir un modal o una nueva vista
  const name = prompt('Nombre del destino:');
  if (name) {
    const newDestination: Partial<Destination> = {
      name,
      description: '',
      countryCode: '',
      type: 'CITY',
      lastModified: new Date().toISOString()
    };
    this.destinationService.createDestination(newDestination).subscribe(() => {
      this.loadDestinations();
    });
  }
}

openUpdateForm(): void {
  if (!this.selectedDestination) return;

  const name = prompt('Nuevo nombre:', this.selectedDestination.name);
  if (name !== null) {
    const updated = {
      ...this.selectedDestination,
      name,
      lastModified: new Date().toISOString()
    };
    this.destinationService.updateDestination(updated).subscribe(() => {
      this.loadDestinations();
      this.selectedDestination = null;
    });
  }
}

deleteSelected(): void {
  if (this.selectedDestination && confirm('¿Estás seguro de que quieres eliminar este destino?')) {
    this.destinationService.deleteDestination(this.selectedDestination.id).subscribe(() => {
      this.loadDestinations();
      this.selectedDestination = null;
    });
  }
}

  nextPage(): void {
    if (this.hasMore) {
      this.page++;
      this.loadDestinations();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadDestinations();
    }
  }
}