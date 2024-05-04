import { Injectable } from '@angular/core';
import { HttpService } from '../helpers/http.service';
import { API_PATH } from '../shared/constant/route.constant';

@Injectable({
  providedIn: 'root',
})
export class RoleService {

  constructor(private http: HttpService) { }

  getRole() {
    return this.http.get(API_PATH.ROLE + 'list');
  }
}
