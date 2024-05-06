import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RoleService } from '../../service/role.service';
import { UserService } from '../../service/user.service';
import { Role } from '../../interface/role.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DevicePipe } from "../../pipe/device.pipe";
import { ToastrService } from 'ngx-toastr';
import { PcListService } from '../../service/pc-list.service';
import { PcList } from '../../interface/pcList.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { UserStore } from '../../shared/signal.store';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../../auth.interceptor';

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatExpansionModule, MatAccordion, MatFormFieldModule, MatSelectModule, MatTableModule, MatPaginatorModule, DevicePipe, MatIconModule, MatDialogModule],
})
export class UserComponent {
  readonly userStore = inject(UserStore)
  isEdit: boolean = false;
  beforeUpdateUser: any;
  userCrudFrom!: FormGroup;
  isOpen: boolean = false
  roleList!: Role[];
  pcList!: PcList[];
  userDataSource!: any;
  displayedColumns: string[] = ['NO', 'user_name', 'email', 'role_name', 'employee_id', 'pcCount', 'Action'];
  displayedColumns1: string[] = ['role_name'];
  pageSizeOptions: number[] = [10, 25, 50, 100];
  isSelectedAll: boolean = false;
  pageSize = 10;
  pageEvent: any = {
    length: 0, pageIndex: 0, pageSize: this.pageSize
  };
  @ViewChild(MatAccordion) accordion?: MatAccordion;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private pcListService: PcListService,
    private userService: UserService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.userCrudFrom = this.formBuilder.group({
      user_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      employee_id: ['', [Validators.required]],
      role_name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      pc_permission: ['']
    });
    this.getAllRoles();
    this.getAllPCList();
    this.getAllUsers();
  }

  openPanel() {
    this.userCrudFrom.reset();
    this.isEdit = false
    if (this.isOpen) {
      this.accordion?.closeAll();
    } else {
      this.accordion?.openAll();
    }
    this.isOpen = !this.isOpen;

  }

  cancelButton() {
    this.accordion?.closeAll();
    this.isOpen = !this.isOpen;
  }

  async addNewUser() {

    if (this.userCrudFrom.valid) {
      const pc_list = this.userCrudFrom.value.pc_permission;

      let new_pc_permission: any = [];
      pc_list.forEach((element: any) => {
        new_pc_permission.push({ pc_list_id: element, permission: 1 });
      });

      this.userCrudFrom.value.pc_permission = new_pc_permission

      const isDataCreated = await this.userStore.createUserData(this.userCrudFrom.value);
      if (isDataCreated) {
        this.userDataSource = this.userStore.userData();
        this.setMatTable();
        this.cancelButton();
      }
    }
  }

  async updateUser() {
    if (this.userCrudFrom.valid) {
      console.log('updateUser: called');
      const pc_list = this.userCrudFrom.value.pc_permission;

      let new_pc_permission: any = [];
      pc_list.forEach((element: any) => {
        new_pc_permission.push({ pc_list_id: element, permission: 1 });
      });

      this.userCrudFrom.value.pc_permission = new_pc_permission

      const isDataLoad = await this.userStore.updateUserData(this.beforeUpdateUser.user_id, this.userCrudFrom.value);
      if (isDataLoad) {
        this.userDataSource = this.userStore.userData();
        this.setMatTable();
        this.cancelButton();
      }

    }
  }

  openModel() {
    if (this.isOpen) {
      this.accordion?.closeAll();
    } else {
      this.accordion?.openAll();
    }
    this.isOpen = !this.isOpen;
  }

  getAllRoles() {
    this.roleService.getRole().subscribe((res: any) => {
      this.roleList = res.data;
    }, err => {
      console.log('error while fetching data');
    })
  }

  getAllPCList() {
    this.pcListService.getPcList().subscribe((res: any) => {
      this.pcList = res.data;
    }, err => {
      console.log('error while fetching data');
    })
  }

  async getAllUsers() {
    const isDataLoad = await this.userStore.getFormData();
    if (isDataLoad) {
      this.userDataSource = this.userStore.userData();
      this.setMatTable();
    }
  }

  setMatTable() {
    this.userDataSource = new MatTableDataSource(this.userDataSource);
    this.userDataSource.paginator = this.paginator;
  }

  update(element: any) {
    this.beforeUpdateUser = element;
    this.isEdit = true;
    element.pc_permission = element.assigned_pc?.map((el: any) => {
      return el.pc_list_id;
    })
    this.userCrudFrom.patchValue(element);
    this.openModel();
    this.setValidator();
  }

  openDialog(element: any) {
    this.beforeUpdateUser = element;
    this.dialog.open(DialogComponent, { data: { id: this.beforeUpdateUser.user_id } }).afterClosed().subscribe(data => {
      if (data.data == 'true') {
        this.userDataSource = this.userStore.userData();
        this.setMatTable();
        this.cancelButton();
      }
    });
  }

  setValidator() {
    if (this.isEdit) {
      this.userCrudFrom.get('password')?.clearValidators();
      this.userCrudFrom.get('password')?.updateValueAndValidity()
    }
  }

  delete(element: any) {
    this.beforeUpdateUser = element;
    this.openDialog(element);
  }

  setUserData(data: any) {
    this.userDataSource = data;
  }

}