import { Injectable } from '@angular/core';
import { HttpService } from '../helpers/http.service';
import { API_PATH } from '../shared/constant/route.constant';

@Injectable({
  providedIn: 'root'
})
export class PcListService {

  constructor(private http: HttpService) { }

  getPcList() {
    return this.http.get(API_PATH.PC_LIST + 'listall');
  }
}
