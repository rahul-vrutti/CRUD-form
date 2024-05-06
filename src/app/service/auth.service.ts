import { Injectable } from '@angular/core';
import { HttpService } from '../helpers/http.service';
import { API_PATH } from '../shared/constant/route.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpService) { }

  login(data: any) {
    return this.http.post(API_PATH.AUTH + 'login', data)
  }
}
