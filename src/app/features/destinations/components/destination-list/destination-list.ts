import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinationService } from '../../services/destination.service';
import { FormsModule } from '@angular/forms';
import { Destination } from '../../models/destination.model';
import { DestinationFormDialog } from '../destination-form/destination-form';
import { ConfirmDeleteDialog } from '../../../../shared/components/confirm-dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatepickerLocale } from '../../../../shared/components/locale-date-picker/datepicker-locale';
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-destination-list',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule,
      MatTableModule,
      MatButtonModule,
      MatInputModule,
      MatFormFieldModule,
      MatDialogModule,
      MatIconModule,
      MatRadioModule,
      MatPaginatorModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
      DatepickerLocale,
      MatSortModule ],
  
  templateUrl: './destination-list.html',
  styleUrl: './destination-list.css'
})

export class DestinationList implements AfterViewInit {
  destinations: Destination[] = [];
  filters = { name: '', countryCode: '', type: '', lastModified: null as Date | null };
  page = 0;
  size = 8;
  hasMore = false;
  displayedColumns: string[] = ['select', 'id', 'name', 'description', 'countryCode', 'type', 'lastModified'];
  showForm = false;
  formMode: 'create' | 'edit' = 'create';
  showDeleteDialog = false;
  editableDestination: Destination | null = null;
  selectedDestination: Destination | null = null;

  typeLabels: { [key: string]: string } = {
    CITY: 'Ciudad',
    BEACH: 'Playa',
    MOUNTAIN: 'Montaña',
    ISLAND: 'Isla',
    CULTURAL: 'Cultural'
  };
  destinationTypes: string[] = Object.keys(this.typeLabels);

  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<Destination>();

  selectDestination(destination: Destination): void {
    this.selectedDestination = destination;
  }

  constructor(private destinationService: DestinationService, private dialog: MatDialog) {}
  
  ngOnInit(): void {
    this.loadDestinations();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  loadDestinations(): void {
    this.destinationService.getDestinations(this.page, this.size, this.filters).subscribe(response => {
      this.destinations = response.content;
      this.hasMore = !response.last;
      this.dataSource.data = this.destinations;
    });
  }

  applyFilters(): void {
    this.page = 0;
    this.loadDestinations();
  }

  openCreateModal() {
    const dialogRef = this.dialog.open(DestinationFormDialog, {
      data: { destination: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.destinationService.createDestination(result).subscribe(() => this.loadDestinations());
      }
    });
  }

  openEditModal() {
    if (!this.selectedDestination) return;

    const dialogRef = this.dialog.open(DestinationFormDialog, {
      data: { destination: this.selectedDestination }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.destinationService.updateDestination(result).subscribe(() => this.loadDestinations());
      }
    });
  }

  closeForm(): void {
    this.showForm = false;
    this.editableDestination = null;
  }

  saveDestination(dest: Destination): void {
    if (this.formMode === 'create') {
      dest.lastModified = new Date().toISOString();
      this.destinationService.createDestination(dest).subscribe(() => {
        this.loadDestinations();
        this.closeForm();
      });
    } else {
      dest.lastModified = new Date().toISOString();
      this.destinationService.updateDestination(dest).subscribe(() => {
        this.loadDestinations();
        this.closeForm();
      });
    }
  }

  openDeleteConfirm() {
    if (!this.selectedDestination) return;

    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      data: { name: this.selectedDestination.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.selectedDestination && this.selectedDestination.id != null) {
          this.destinationService.deleteDestination(this.selectedDestination.id).subscribe(() => {
            this.selectedDestination = null;
            this.loadDestinations();
          });
        }
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
  }

  confirmDelete(): void {
    if (!this.selectedDestination) return;
    this.destinationService.deleteDestination(this.selectedDestination.id).subscribe(() => {
      this.loadDestinations();
      this.selectedDestination = null;
      this.showDeleteDialog = false;
    });
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

  exportToExcel(): void {
    const exportData = this.dataSource.data.map(dest => ({
      ID: dest.id,
      Nombre: dest.name,
      Descripción: dest.description,
      Código: dest.countryCode,
      Tipo: dest.type,
      'Última modificación': new Date(dest.lastModified).toLocaleString()
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { 'Destinos': worksheet }, SheetNames: ['Destinos'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, 'destinos.xlsx');
}


}


