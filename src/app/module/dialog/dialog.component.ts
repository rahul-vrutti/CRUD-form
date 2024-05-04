import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../service/user.service';
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private toast: ToastrService
  ) { }

  delateDevice() {
    this.userService.deleteUser(this.data.id).subscribe((res: any) => {
      if (res.success == true) {
        this.dialogRef.close({ action: 1, data: "true" });
        this.toast.success(res.message, 'Success');
      }
    }, err => {
      this.toast.error(err.error.message, 'Error');
    });
    this.dialogRef.close();
  }

}
