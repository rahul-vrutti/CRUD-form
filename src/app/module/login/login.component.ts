import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginCrudForm!: FormGroup;
  token: any

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toster: ToastrService
  ) { }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.loginCrudForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required,]]
    });
    if (this.token) {
      this.router.navigate(['/user']);
    }
  }

  login() {
    if (this.loginCrudForm.valid) {
      this.authService.login(this.loginCrudForm.value).subscribe((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/user']);
          this.toster.success(res.message);
        } else {
          this.toster.error(res.message);
        }
      })
    }
  }
} 
