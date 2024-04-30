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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ RouterModule, NzMenuModule, NzFormModule,  NzButtonModule, ReactiveFormsModule,
     NzIconModule, FormsModule,  NzCheckboxModule, NzInputModule, TopMenuComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  validateForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { 
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
        this.router.navigate(['/dashboard']);
      } else {
        console.log('Datos erroneos');
        // Aquí podrías mostrar un mensaje de error o realizar alguna acción adicional
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
  
}
