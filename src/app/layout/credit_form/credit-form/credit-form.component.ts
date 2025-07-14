import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from '../../../misc/navBar/nav-bar/nav-bar.component';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import axios from 'axios';

@Component({
  selector: 'app-credit-form',
  standalone: true,
  templateUrl: './credit-form.component.html',
  styleUrls: ['./credit-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzUploadModule,
    NzModalModule,
    NzMessageModule,
    NavBarComponent
  ]
})
export class CreditFormComponent {
  validateForm: FormGroup;
  opciones0a99: number[] = Array.from({ length: 100 }, (_, i) => i);
  showGuaranteeDoc = false;

  documentFiles: { [key: string]: File | null } = {
    ine: null,
    birth: null,
    address: null,
    guaranteeDoc: null
  };

  documentUrls: { [key: string]: string | null } = {
    ine: null,
    birth: null,
    address: null,
    guaranteeDoc: null
  };

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      credit: ['', Validators.required],
      term: [0, Validators.required],
      amount: [null, Validators.required],
      guarantee: [''], 
      guaranteeValue: [''] 
    });
  }

lastRequestId: string = ''; // Declarar en tu clase

  async onGuaranteeChange(): Promise<void> {
    const value = this.validateForm.get('guarantee')?.value;
    this.showGuaranteeDoc = value !== 'noGuarantee' && value !== '';

    if (this.showGuaranteeDoc) {
      const rawToken = localStorage.getItem('accessToken');
      let token = '';

      if (rawToken) {
        try {
          const parsed = JSON.parse(rawToken);
          token = parsed._value || '';
        } catch (e) {
          token = rawToken;
        }
      }

      try {
        const response = await axios.get('http://localhost:3002/api/v1/requests/last', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.lastRequestId = response.data?.data?.lastId + 1 || '';
      } catch (error) {
        console.error('Error al consultar la última solicitud:', error);
      }
    }
  }

  async handleFileChange(event: Event, type: string): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.documentFiles[type] = file;

      const rawToken = localStorage.getItem('accessToken');
      let token = '';
      if (rawToken) {
        try {
          const parsed = JSON.parse(rawToken);
          token = parsed._value || '';
        } catch (e) {
          token = rawToken;
        }
      }

      // Construir endpoint con base en tipo
      let uploadUrl = '';
      let getUrl = '';

      if (type === 'guaranteeDoc') {
        if (!this.lastRequestId) {
          this.message.error('No se ha obtenido el ID de la última solicitud.');
          return;
        }
        uploadUrl = `http://localhost:3010/api/v1/documents/${this.lastRequestId}/guarantee`;
        getUrl = `http://localhost:3010/api/v1/documents/guarantee/file/${this.lastRequestId}`;
      } else {
        const endpoints: Record<string, string> = {
          ine: 'http://localhost:3010/api/v1/documents/ine',
          birth: 'http://localhost:3010/api/v1/documents/birth',
          address: 'http://localhost:3010/api/v1/documents/domicile'
        };
        uploadUrl = endpoints[type];
        getUrl = endpoints[type];
      }

      try {
        // subir archivo
        const formData = new FormData();
        formData.append('file', file);

        await axios.post(uploadUrl, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        this.message.success(`Documento ${type} subido correctamente`);

        // obtener link
        const response = await axios.get(getUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const url = response.data?.data?.url || null;
        if (url) {
          this.documentUrls[type] = url;
          console.log(`URL del documento ${type}:`, url);
        } else {
          this.message.warning(`No se obtuvo URL para el documento ${type}`);
        }
      } catch (error) {
        console.error(`Error al subir u obtener URL del documento ${type}:`, error);
        this.message.error(`Error al subir documento ${type}`);
      }
    }
  }

  async submitForm(): Promise<void> {
    if (this.validateForm.valid) {
      const formValues = this.validateForm.value;

      const creditMap: Record<string, number> = {
        personal: 1,
        hipotecario: 2,
        prendario: 3
      };

      const guaranteeMap: Record<string, number> = {
        mueble: 1,
        inmueble: 2,
        noGuarantee: 0
      };

      const result = {
        credit_type: creditMap[formValues.credit] || 0,
        amount: formValues.amount,
        loan_term: formValues.term,
        guarantee_type: guaranteeMap[formValues.guarantee] || 0,
        guarantee_value: formValues.guaranteeValue || 0,

        url_ine: this.documentUrls['ine'],
        url_birth_certificate: this.documentUrls['birth'],
        url_address: this.documentUrls['address'],
        url_guarantee: this.showGuaranteeDoc ? this.documentUrls['guaranteeDoc'] : null
      };
      const rawToken = localStorage.getItem('accessToken');
      let token = '';

      if (rawToken) {
        try {
          const parsed = JSON.parse(rawToken);
          token = parsed._value || '';
        } catch (e) {
          token = rawToken;
        }
      }

      const url = `http://localhost:3002/api/v1/requests`;
      
    try {
      const response = await axios.post(
        url, result,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Respuesta:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
      console.log('Datos para enviar:', result);
      this.message.success('Solicitud creada');
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
