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

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      credit: ['', Validators.required],
      term: [0, Validators.required],
      amount: [null, Validators.required],
      guarantee: [''], // garantía opcional
      guaranteeValue: [''] // valor también opcional
    });
  }

  onGuaranteeChange(): void {
    const value = this.validateForm.get('guarantee')?.value;
    this.showGuaranteeDoc = value !== 'noGuarantee' && value !== '';
  }

  handleFileChange(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.documentFiles[type] = input.files[0];
    }
  }

  submitForm(): void {
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
        credit_id: creditMap[formValues.credit] || 0,
        amount: formValues.amount,
        term: formValues.term,
        guarantee_id: guaranteeMap[formValues.guarantee] || 0,
        guarantee_value: formValues.guaranteeValue || null,
        documents: {
          ine: this.documentFiles['ine']?.name || 'No cargado',
          birth_certificate: this.documentFiles['birth']?.name || 'No cargado',
          address_proof: this.documentFiles['address']?.name || 'No cargado',
          guarantee_proof: this.showGuaranteeDoc
            ? this.documentFiles['guaranteeDoc']?.name || 'No cargado'
            : 'No aplica'
        },
        token: localStorage.getItem('accessToken') || ''
      };

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
