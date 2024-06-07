import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from '../misc/topMenu/top-menu/top-menu.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [TopMenuComponent, CommonModule, NzFormModule, NzInputModule, NzSelectModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  validateForm: FormGroup;
  opciones18a99: number[] = Array.from({ length: 100 }, (_, i) => i + 18);
  opciones0a99: number[] = Array.from({length: 100}, (_, i) => i);

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);//Datos del form, panzon!!!!!!!!!!!
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(private fb: FormBuilder) {
    this.validateForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      rfc: ['', [Validators.required]],
      curp: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      age: [18, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      civilStatus: ['', [Validators.required]],
      educationLevel: ['', [Validators.required]],
      laboralYears: ['', [Validators.required]],
      workingStatus: ['', [Validators.required]],
    });
  }
}
