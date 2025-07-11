import { Component } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router, RouterModule } from '@angular/router';
import { TopMenuComponent } from '../../../misc/topMenu/top-menu/top-menu.component';
import { LocalStorageService } from 'angular-web-storage';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    NzMenuModule,
    NzFormModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzIconModule,
    FormsModule,
    NzCheckboxModule,
    NzInputModule,
    TopMenuComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private localStorage: LocalStorageService,
    private http: HttpClient
  ) {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const { userName, password } = this.validateForm.value;

      if (userName === 'risky@mail.com' && password === 'test123') {
        console.log('submit', this.validateForm.value);
        this.localStorage.set('typeUser', 'normal');
        this.router.navigate(['/dashboard']);
      } else if (userName === 'radmin@mail.com' && password === 'admin123') {
        console.log('submit', this.validateForm.value);
        this.localStorage.set('typeUser', 'admin');
        this.router.navigate(['/dashboard']);
      } else {
        this.login(userName, password);
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  navigateToSignUp(): void {
    this.router.navigate(['/sign-up']);
  }

async login(email: string, password: string) {
  try {
    const url = 'http://localhost:3000/api/v1/auth/login';

    const requestBody = { email, password };
    console.log('Body a enviar:', requestBody);

    const response = await axios.post(url, requestBody);
    console.log('RESPUESTA DEL SERVIDOR:', response.data.data);

    const token = response.data.data.accessToken; 
    this.localStorage.set('accessToken', token);

    const parseJwt = (token: string) => {
      try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(payload);
      } catch {
        return null;
      }
    };

    const payload = parseJwt(token);
    if (payload && payload['cognito:groups'] && payload['cognito:groups'].length > 0) {
      const userGroup = payload['cognito:groups'][0]; 
      this.localStorage.set('typeUser', userGroup);
    } else {
      this.localStorage.set('typeUser', 'normal'); 
    }

    this.router.navigate(['/dashboard']);
  } catch (error) {
    console.error('Error durante login:', error);
  }
}
}
