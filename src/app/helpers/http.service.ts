import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../shared/constant/route.constant';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  get<T>(url: string, params?: any): Observable<T> {
    return this.http.get<T>(API_URL + url, { params: params });
  }
  post<T, G>(url: string, params: G): Observable<T> {
    return this.http.post<T>(API_URL + url, params);
  }
  put<T, G>(url: string, id: number | string, params: G): Observable<T> {
    return this.http.put<T>(API_URL + url + '/' + id, params);
  }
  patch<T, G>(url: string, id: number | string, params?: G): Observable<T> {
    return this.http.patch<T>(API_URL + url + '/' + id, params);
  }
  delete<T>(url: string, id: number | string): Observable<T> {
    return this.http.delete<T>(API_URL + url + '/' + id);
  }

}

