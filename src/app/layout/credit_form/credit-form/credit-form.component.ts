import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavBarComponent } from '../../../misc/navBar/nav-bar/nav-bar.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-credit-form',
  standalone: true,
  imports: [CommonModule, NzFormModule, NzInputModule, NzSelectModule, ReactiveFormsModule, NavBarComponent, NzUploadModule, NzModalModule],
  templateUrl: './credit-form.component.html',
  styleUrls: ['./credit-form.component.css']
})
export class CreditFormComponent {
  validateForm: FormGroup;
  opciones0a99: number[] = Array.from({ length: 100 }, (_, i) => i);
  fileList: NzUploadFile[] = [];
  uploading = false;
  previewImage: string | undefined = '';
  previewVisible = false;
    previewTitle: string | undefined;

  constructor(private fb: FormBuilder, private modal: NzModalService) {
    this.validateForm = this.fb.group({
      credit: ['', [Validators.required]],
      term: [0, [Validators.required]],
      guarantee: ['', [Validators.required]],
      guaranteeValue: [''],
      children: [0, [Validators.required]],
      dependents: [0, [Validators.required]],
      properties: ['', [Validators.required]],
      housingType: ['', [Validators.required]],
      position: ['', [Validators.required]],
      anualIncome: [0, [Validators.required]],
      ocupation: ['', [Validators.required]],
    });
  }

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

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [file];
    return false;
  };

  handleChange(info: { file: NzUploadFile }): void {
    if (info.file.status === 'uploading') {
      this.uploading = true;
      return;
    }
    if (info.file.status === 'done') {
      this.modal.success({
        nzTitle: 'Archivo subido exitosamente',
        nzContent: `${info.file.name}`
      });
      this.uploading = false;
    }
  }

  handlePreview = (file: NzUploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  handleCancel(): void {
    this.previewVisible = false;
  }
}
