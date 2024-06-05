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
  imports: [ CommonModule, NzFormModule, NzInputModule, NzSelectModule, ReactiveFormsModule, NavBarComponent ],
  templateUrl: './credit-form.component.html',
  styleUrl: './credit-form.component.css'
})
export class CreditFormComponent {
  validateForm: FormGroup;

  // Opciones para edad, hijos y personas que dependen
  opciones0a99: number[] = Array.from({length: 100}, (_, i) => i);

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
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
      genero: ['masculino', [Validators.required]],
      propiedades: ['casa', [Validators.required]],
      hijos: [0, [Validators.required]],
      edad: [18, [Validators.required]],
      ingresoAnual: [0, [Validators.required]],
      estatusTrabajo: ['asalariado', [Validators.required]],
      gradoEstudios: ['primaria', [Validators.required]],
      estadoCivil: ['soltero', [Validators.required]],
      tipoVivienda: ['propia', [Validators.required]],
      fechaTrabajo: ['', [Validators.required]],
      ocupacion: ['', [Validators.required]],
      personasDependen: [0, [Validators.required]]
    });
  }
}
