import { Component, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatExpansionModule, MatAccordion, MatFormFieldModule, MatSelectModule, MatTableModule, MatPaginatorModule, DevicePipe, MatIconModule, MatDialogModule],
})
export class UserComponent {
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
    // this.userCrudFrom.reset();
    this.accordion?.closeAll();
    this.isOpen = !this.isOpen;
  }

  addNewUser() {

    if (this.userCrudFrom.valid) {
      const pc_list = this.userCrudFrom.value.pc_permission;

      let new_pc_permission: any = [];
      pc_list.forEach((element: any) => {
        new_pc_permission.push({ pc_list_id: element, permission: 1 });
      });

      this.userCrudFrom.value.pc_permission = new_pc_permission

      this.userService.addUser(this.userCrudFrom.value).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success(res.message, 'Success');
          this.getAllUsers();
          this.cancelButton();
        } else {
          this.toastr.error(res.message, 'Error');
        }
      }, err => {
        this.toastr.error(err.error.message, 'Error');
      })
    }
  }

  updateUser() {
    if (this.userCrudFrom.valid) {
      console.log('updateUser: called');
      const pc_list = this.userCrudFrom.value.pc_permission;

      let new_pc_permission: any = [];
      pc_list.forEach((element: any) => {
        new_pc_permission.push({ pc_list_id: element, permission: 1 });
      });

      this.userCrudFrom.value.pc_permission = new_pc_permission

      this.userService.updateUser(this.beforeUpdateUser.user_id, this.userCrudFrom.value).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success(res.message, 'Success');
          this.getAllUsers();
          this.cancelButton();
          // this.userCrudFrom.reset();
        } else {
          this.toastr.error(res.message, 'Error');
        }
      }, err => {
        this.toastr.error(err.error.message, 'Error');
      })
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

  getAllUsers() {
    this.userService.getUser().subscribe((res: any) => {
      this.userDataSource = res.data;
      this.setMatTable();
    }, err => {
      console.log('error while fetching data');
    })
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
        this.getAllUsers();
      }
    });
  }

  setValidator() {
    if (this.isEdit) {
      this.userCrudFrom.get('password')?.clearValidators();
      this.userCrudFrom.get('password')?.updateValueAndValidity()
    }
  }
}