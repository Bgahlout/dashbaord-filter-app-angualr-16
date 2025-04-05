import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit {
  dropdownForm: FormGroup;
  dropdown1Options = ['Option 1', 'Option 2', 'Option 3'];
  dropdown2Options = ['Option A', 'Option B', 'Option C'];
  dropdown3Options = ['Choice X', 'Choice Y', 'Choice Z'];

  displayedColumns: string[] = ['id', 'title', 'body'];
  dataSource = new MatTableDataSource<any>([]); // Use MatTableDataSource for sorting and pagination
  private filterSubject = new BehaviorSubject<any>(null);


  @ViewChild(MatPaginator) paginator!: MatPaginator; // Reference to MatPaginator
  @ViewChild(MatSort) sort!: MatSort; // Reference to MatSort

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.dropdownForm = this.fb.group({
      dropdown1: [[]], // Multi-select dropdowns initialized as empty arrays
      dropdown2: [[]],
      dropdown3: [[]]
    });
  }

  ngOnInit(): void {
    // Subscribe to filterSubject to handle emitted filter values
    this.filterSubject.pipe(
      debounceTime(300), // Wait for user input to stabilize
      switchMap((filters) => this.fetchData(filters))
    ).subscribe((filteredData) => {
      this.dataSource.data = filteredData; // Update the table data
    });

    this.fetchData(null); // Initial fetch without filters
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Attach paginator to the data source
    this.dataSource.sort = this.sort; // Attach sorting to the data source
  }

  resetFilters(): void {
    this.dropdownForm.reset({ dropdown1: [], dropdown2: [], dropdown3: [] });
    this.filterSubject.next(null); // Reset the filter
  }

  applyFilters(): void {
    this.filterSubject.next(this.dropdownForm.value); // Emit the current filter values
  }

  fetchData(filters: any): Observable<any[]> {
    return this.apiService.fetchData().pipe(
      switchMap((data) => {
        if (!filters) {
          return [data]; // Return all data if no filters are applied
        }

        // Filter data based on dropdown values
        const filteredData = data.filter((item) => {
          return (
            (!filters.dropdown1.length || filters.dropdown1.includes(item.title)) &&
            (!filters.dropdown2.length || filters.dropdown2.includes(item.body)) &&
            (!filters.dropdown3.length || filters.dropdown3.includes(item.title))
          );
        });

        return [filteredData];
      })
    );
  }
}