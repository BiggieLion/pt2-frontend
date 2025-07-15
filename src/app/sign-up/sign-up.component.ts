import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
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
    NzMessageModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  validateForm: FormGroup;

  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.validateForm = this.fb.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        rfc: ['', [Validators.required, this.rfcValidator]],
        curp: ['', [Validators.required, this.curpValidator]],
        birthdate: ['', [Validators.required, this.birthdateValidator]],
        civil_status: ['', Validators.required],
        education_level: ['', Validators.required],
        occupation_type: ['', Validators.required],
        gender: ['', Validators.required],
        monthly_income: [null, [Validators.required, Validators.min(0)]],
        has_own_car: [false],
        has_own_realty: [false],
        count_children: [0, [Validators.required, Validators.min(0)]],
        count_adults: [0, [Validators.required, Validators.min(0)]],
        count_family_members: [0, [Validators.required, Validators.min(0)]],
        address: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, this.securePasswordValidator]],
        confirmPassword: ['', Validators.required],
        days_employed: [null, [Validators.required, Validators.min(0)]],
      },
      { validators: [this.passwordMatchValidator, this.familyMembersValidator] }
    );
  }

  birthdateValidator = (control: AbstractControl) => {
    const value = control.value;
    if (!value) return null;

    const regex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regex.test(value)) return { invalidFormat: true };

    const [day, month, year] = value.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return { invalidDate: true };
    }

    return null;
  };

  securePasswordValidator = (control: AbstractControl) => {
    const value = control.value;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(value) ? null : { insecure: true };
  };

  rfcValidator = (control: AbstractControl) => {
    const value = control.value;
    const regex = /^([A-ZÑ&]{3,4})\d{6}[A-Z0-9]{3}$/;
    return regex.test(value) ? null : { invalidRfc: true };
  };

  curpValidator = (control: AbstractControl) => {
    const value = control.value;
    const regex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
    return regex.test(value) ? null : { invalidCurp: true };
  };

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  familyMembersValidator(form: FormGroup) {
    const children = form.get('count_children')?.value || 0;
    const adults = form.get('count_adults')?.value || 0;
    const total = form.get('count_family_members')?.value || 0;

    return children + adults <= total ? null : { familyMismatch: true };
  }

  onBirthdateBlur(): void {
    const control = this.validateForm.get('birthdate');
    if (control && control.value && control.invalid) {
      this.message.error(
        'Fecha de nacimiento inválida o con formato incorrecto (DD/MM/AAAA)'
      );
    }
  }

  async submitForm(): Promise<void> {
    if (this.validateForm.valid) {
      const formValue = { ...this.validateForm.value };
      delete formValue.confirmPassword;

      const [day, month, year] = formValue.birthdate.split('/').map(Number);
      formValue.birthdate = new Date(year, month - 1, day);

      try {
        const url =
          'http://ec2-34-207-55-72.compute-1.amazonaws.com:3004/api/v1/requester';
        await axios.post(url, formValue);
        this.message.success('Formulario enviado correctamente');
        this.validateForm.reset();
      } catch (error: any) {
        console.error('Error al enviar formulario:', error);

        const status = error.response?.status;
        const backendMessage = error.response?.data?.message;

        if (
          status === 409 &&
          backendMessage === 'Requester RFC already registered'
        ) {
          this.message.error(
            'El RFC ya está registrado. Verifica la información.'
          );
        } else if (status === 500 && backendMessage === 'User already exists') {
          this.message.error(
            'El usuario ya existe. Intenta con otro correo electrónico.'
          );
        } else {
          this.message.error(
            'Error al enviar el formulario. Intenta más tarde.'
          );
        }
      }
    } else {
      if (this.validateForm.errors?.['mismatch']) {
        this.message.error('Las contraseñas no coinciden');
        return;
      }
      if (this.validateForm.errors?.['familyMismatch']) {
        this.message.error(
          'La suma de niños y adultos no puede ser mayor que los miembros del hogar'
        );
        return;
      }

      const invalidFields = [];
      const controls = this.validateForm.controls;

      for (const key in controls) {
        const control = controls[key];
        if (control.invalid) {
          if (key === 'password' && control.errors?.['insecure']) {
            invalidFields.push('Contraseña (debe ser segura)');
          } else if (key === 'confirmPassword') {
            invalidFields.push('Confirmar contraseña');
          } else if (key === 'birthdate' && control.errors?.['invalidFormat']) {
            invalidFields.push('Fecha de nacimiento (formato incorrecto)');
          } else if (key === 'birthdate' && control.errors?.['invalidDate']) {
            invalidFields.push('Fecha de nacimiento (inválida)');
          } else if (key === 'rfc' && control.errors?.['invalidRfc']) {
            invalidFields.push('RFC (formato inválido)');
          } else if (key === 'curp' && control.errors?.['invalidCurp']) {
            invalidFields.push('CURP (formato inválido)');
          } else {
            invalidFields.push(this.getFieldLabel(key));
          }
        }
      }

      this.message.error(
        `Corrige los siguientes campos: ${invalidFields.join(', ')}`
      );

      Object.values(this.validateForm.controls).forEach((control) => {
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
      days_employed: 'Días trabajando',
    };
    return labels[field] || field;
  }
}
