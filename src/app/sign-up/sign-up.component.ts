import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { TopMenuComponent } from '../misc/topMenu/top-menu/top-menu.component';
import axios from 'axios';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    TopMenuComponent,
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzCheckboxModule,
    NzInputNumberModule,
    NzMessageModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      rfc: ['', Validators.required],
      curp: ['', Validators.required],
      birthdate: ['', [Validators.required, this.birthdateValidator]],
      civil_status: ['', Validators.required],
      education_level: ['', Validators.required],
      gender: ['', Validators.required],
      monthly_income: [null, [Validators.required, Validators.min(0)]],
      has_own_car: [false],
      has_own_realty: [false],
      count_children: [0, Validators.required],
      count_adults: [0, Validators.required],
      count_family_members: [0, Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      days_employed: [null, [Validators.required, Validators.min(0)]]
    }, { validators: this.passwordMatchValidator });
  }

  birthdateValidator = (control: any) => {
    const value = control.value;
    if (!value) return null;

    const regex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(value)) return { invalidFormat: true };

    const parts = value.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
      return { invalidDate: true };
    }

    return null;
  };

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onBirthdateBlur(): void {
    const control = this.validateForm.get('birthdate');
    if (control && control.value && control.invalid) {
      this.message.error('Fecha de nacimiento inválida o con formato incorrecto (DD/MM/AAAA)');
    }
  }

async submitForm(): Promise<void> {
  if (this.validateForm.valid) {
    const formValue = { ...this.validateForm.value };
    delete formValue.confirmPassword;

    console.log('Body que se enviaría:', formValue);

    try {
      const url = 'http://localhost:3004/api/v1/requester';
      const response = await axios.post(url, formValue);
      console.log('RESPUESTA DEL SERVIDOR:', response.data);
      this.message.success('Formulario enviado correctamente');
      this.validateForm.reset();
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      this.message.error('Error al enviar el formulario');
    }

    this.message.success('Formulario válido. Datos listos para enviar.');
  } else {
    if (this.validateForm.errors?.['mismatch']) {
      this.message.error('Las contraseñas no coinciden');
      return;
    }

    const invalidFields = [];
    const controls = this.validateForm.controls;

    for (const key in controls) {
      const control = controls[key];
      if (control.invalid) {
        if (key === 'password' && control.errors?.['required']) {
          invalidFields.push('Contraseña (es requerida)');
        } else if (key === 'confirmPassword') {
          invalidFields.push('Confirmar contraseña');
        } else if (key === 'birthdate' && control.errors?.['invalidFormat']) {
          invalidFields.push('Fecha de nacimiento (formato incorrecto)');
        } else if (key === 'birthdate' && control.errors?.['invalidDate']) {
          invalidFields.push('Fecha de nacimiento (fecha inválida)');
        } else {
          invalidFields.push(this.getFieldLabel(key));
        }
      }
    }

    this.message.error(`Corrige los siguientes campos: ${invalidFields.join(', ')}`);

    Object.values(this.validateForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
}


  getFieldLabel(field: string): string {
    const labels: { [key: string]: string } = {
      firstname: 'Nombre(s)',
      lastname: 'Apellidos',
      rfc: 'RFC',
      curp: 'CURP',
      birthdate: 'Fecha de nacimiento',
      civil_status: 'Estado civil',
      education_level: 'Nivel educativo',
      gender: 'Género',
      monthly_income: 'Ingreso mensual',
      has_own_car: '¿Cuenta con automóvil?',
      has_own_realty: '¿Cuenta con propiedad?',
      count_children: 'Número de hijos',
      count_adults: 'Número de adultos',
      count_family_members: 'Miembros en el hogar',
      address: 'Dirección',
      email: 'Correo electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      days_employed: 'Días trabajando'
    };
    return labels[field] || field;
  }
}
