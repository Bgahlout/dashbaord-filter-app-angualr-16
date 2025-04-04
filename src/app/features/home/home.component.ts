import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';

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
    MatTableModule], // Import shared components
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  dropdownForm: FormGroup;
  dropdown1Options = ['Option 1', 'Option 2', 'Option 3'];
  dropdown2Options = ['Option A', 'Option B', 'Option C'];
  dropdown3Options = ['Choice X', 'Choice Y', 'Choice Z'];

  displayedColumns: string[] = ['id', 'name', 'value'];
  private filterSubject = new BehaviorSubject<any>(null);
  filteredData$: Observable<any[]>;

  constructor(private fb: FormBuilder) {
    this.dropdownForm = this.fb.group({
      dropdown1: [[]], // Multi-select dropdowns initialized as empty arrays
      dropdown2: [[]],
      dropdown3: [[]]
    });

    // Reactive programming: Fetch data based on filters
    this.filteredData$ = this.filterSubject.pipe(
      debounceTime(300), // Wait for user input to stabilize
      switchMap((filters) => this.fetchData(filters))
    );
  }

  resetFilters(): void {
    this.dropdownForm.reset({ dropdown1: [], dropdown2: [], dropdown3: [] });
    this.filterSubject.next([]); // Reset the filter
  }


  applyFilters(): void {
    this.filterSubject.next(this.dropdownForm.value); // Emit the current filter values
  }
  fetchData(filters: any): Observable<any[]> {
    // Simulate an API call with filters
    const mockData = [
      { id: 1, name: 'Item 1', value: 'Value 1' },
      { id: 2, name: 'Item 2', value: 'Value 2' },
      { id: 3, name: 'Item 3', value: 'Value 3' }
    ];

    if (!filters) {
      return of(mockData); // Return all data if no filters are applied
    }

    // Filter data based on dropdown values
    return of(
      mockData.filter((item) => {
        return (
          (!filters.dropdown1.length || filters.dropdown1.includes(item.name)) &&
          (!filters.dropdown2.length || filters.dropdown2.includes(item.value)) &&
          (!filters.dropdown3.length || filters.dropdown3.includes(item.name))
        );
      })
    );
  }
}