import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';
import { NavBarComponent } from '../misc/navBar/nav-bar/nav-bar.component';
import axios from 'axios';

@Component({
  selector: 'app-requester-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzCheckboxModule,
    NzInputNumberModule,
    NzMessageModule,
    NavBarComponent,
  ],
  templateUrl: './requester-edit.component.html',
  styleUrl: './requester-edit.component.css',
})
export class RequesterEditComponent implements OnInit {
  validateForm: FormGroup;
  isBrowser = false;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.validateForm = this.fb.group(
      {
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
        days_employed: [null, [Validators.required, Validators.min(0)]],
      },
      { validators: [this.familyMembersValidator] }
    );
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.fetchSolicitudes();
    }
  }

  async fetchSolicitudes(): Promise<void> {
    try {
      const rawToken = localStorage.getItem('accessToken');
      let token = '';

      if (rawToken) {
        try {
          const parsed = JSON.parse(rawToken);
          token = parsed._value || '';
          console.log('Token obtenido:', token);
        } catch (e) {
          token = rawToken;
        }
      }

      const endpoint = 'http://13.221.39.214:3004/api/v1/requester';
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data?.data || {};
      console.log('Datos recibidos:', data);

      this.userId = data.sub; // <- Guardamos el ID del usuario

      const allowedKeys = Object.keys(this.validateForm.controls);
      const filteredData: any = {};

      allowedKeys.forEach((key) => {
        if (data.hasOwnProperty(key)) {
          filteredData[key] = data[key];
        }
      });

      this.validateForm.patchValue(filteredData);
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
    }
  }

  familyMembersValidator(form: FormGroup) {
    const children = form.get('count_children')?.value || 0;
    const adults = form.get('count_adults')?.value || 0;
    const total = form.get('count_family_members')?.value || 0;

    return children + adults <= total ? null : { familyMismatch: true };
  }

  async submitForm(): Promise<void> {
    if (this.validateForm.valid) {
      const formValue = { ...this.validateForm.value };
      console.log(formValue);
      formValue.monthly_income = Number(formValue.monthly_income);

      const rawToken = localStorage.getItem('accessToken');
      let token = '';

      if (rawToken) {
        try {
          const parsed = JSON.parse(rawToken);
          token = parsed._value || '';
          console.log('Token obtenido:', token);
        } catch (e) {
          token = rawToken;
        }
      }

      try {
        if (!this.userId) {
          this.message.error(
            'No se pudo identificar al usuario para actualizar.'
          );
          return;
        }

        const url = `http://13.221.39.214:3004/api/v1/requester/${this.userId}`;
        await axios.patch(url, formValue, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.message.success('Formulario enviado correctamente');
      } catch (error: any) {
        console.error('Error al enviar formulario:', error);

        const status = error.response?.status;
        const backendMessage = error.response?.data?.message;
      }
    } else {
      if (this.validateForm.errors?.['familyMismatch']) {
        this.message.error(
          'La suma de niños y adultos no puede ser mayor que los miembros del hogar'
        );
        return;
      }

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
      days_employed: 'Días trabajando',
    };
    return labels[field] || field;
  }
}
