import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Destination } from '../models/destination.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DestinationService {
  private apiUrl = 'http://localhost:8080/api/destinations';

  constructor(private http: HttpClient) {}

  getDestinations(page: number = 0, size: number = 10, filters?: any): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (filters?.countryCode) {
        params = params.set('countryCode', filters.countryCode);
    }
    if (filters?.type) {
        params = params.set('type', filters.type);
    }

    return this.http.get(`${this.apiUrl}`, { params });
}

    createDestination(destination: Partial<Destination>): Observable<Destination> {
    return this.http.post<Destination>(`${this.apiUrl}`, destination);
    }

    updateDestination(destination: Destination): Observable<Destination> {
    return this.http.put<Destination>(`${this.apiUrl}/${destination.id}`, destination);
    }

    deleteDestination(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
