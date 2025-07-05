import { Component, OnInit } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule,  } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router, RouterModule } from '@angular/router';
import { TopMenuComponent } from '../../../misc/topMenu/top-menu/top-menu.component';
import { LocalStorageService } from 'angular-web-storage'; 
import axios from 'axios';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ RouterModule, NzMenuModule, NzFormModule,  NzButtonModule, ReactiveFormsModule,
     NzIconModule, FormsModule,  NzCheckboxModule, NzInputModule, TopMenuComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})

export class LoginComponent {
  validateForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private localStorage: LocalStorageService,private http: HttpClient) { 
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const { userName, password } = this.validateForm.value;
      //this.login(userName, password)
      if (userName === 'risky@mail.com' && password === 'test123') {
        console.log('submit', this.validateForm.value);
        this.localStorage.set('typeUser', 'normal'); 
        this.router.navigate(['/dashboard']);
      } else if (userName === 'radmin@mail.com' && password === 'admin123') {
        console.log('submit', this.validateForm.value);
        this.localStorage.set('typeUser', 'admin'); 
        this.router.navigate(['/dashboard']);
      } else {
        console.log('Datos erróneos');
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

  async login(email:string, password:string) {
    try {
      let url = 'http://127.0.0.1:3000/api/v1/auth/login';
      // const response = await axios.get(url);
      const response = await axios.post( url , {
        "email": email,
        "password": password  
      });
      console.log("RESPONSE");
      console.log(response)
    } catch (error) {
      console.error('Error during login:', error);
    }
  }
}
