import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // Simulate a dummy API call
  fetchData(): Observable<any[]> {
    const mockData = [
      { id: 1, name: 'Item 1', value: 'Value 1' },
      { id: 2, name: 'Item 2', value: 'Value 2' },
      { id: 3, name: 'Item 3', value: 'Value 3' }
    ];
    return of(mockData); // Replace with `this.http.get('API_URL')` for real API
  }
}
