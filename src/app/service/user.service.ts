import { Injectable } from '@angular/core';
import { HttpService } from '../helpers/http.service';
import { API_PATH } from '../shared/constant/route.constant';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpService) { }

  getUser() {
    return this.http.get(API_PATH.USER + 'list');
  }

  addUser(data: any) {
    return this.http.post(API_PATH.USER + "create", data);
  }

  updateUser(id: number | string, data: any) {
    return this.http.put(API_PATH.USER + "update", id, data);
  }

  deleteUser(id: number | string) {
    return this.http.delete(API_PATH.USER + "delete", id);
  }
}
