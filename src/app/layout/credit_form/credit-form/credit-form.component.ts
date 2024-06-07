import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavBarComponent } from '../../../misc/navBar/nav-bar/nav-bar.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credit-form',
  standalone: true,
  imports: [CommonModule, NzFormModule, NzInputModule, NzSelectModule, ReactiveFormsModule, NavBarComponent],
  templateUrl: './credit-form.component.html',
  styleUrls: ['./credit-form.component.css']
})
export class CreditFormComponent {
  validateForm: FormGroup;
  opciones0a99: number[] = Array.from({ length: 100 }, (_, i) => i);

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value); //de nuez el form de solicitud~~~~~~~~~~~~~~~
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
      credit: ['', [Validators.required]],
      term: [0, [Validators.required]],
      children: [0, [Validators.required]],
      dependents: [0, [Validators.required]],
      properties: ['', [Validators.required]],
      housingType: ['', [Validators.required]],
      position: ['', [Validators.required]],
      anualIncome: [0, [Validators.required]],
      ocupation: ['', [Validators.required]],
    });
  }
}
