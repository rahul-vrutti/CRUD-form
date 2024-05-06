import { Component, inject, Inject } from '@angular/core';
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
import { UserStore } from '../../shared/signal.store';
import { UserComponent } from '../user/user.component';
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  readonly userStore = inject(UserStore)
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private toast: ToastrService
  ) { }

  async delateDevice() {
    const deleteUser = await this.userStore.deleteUserData(this.data.id);
    if (deleteUser) {
      this.dialogRef.close({ action: 1, data: "true" });
    }
  }

}
