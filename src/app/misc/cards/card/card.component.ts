import { Component } from '@angular/core';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { DetailsComponent } from '../../../layout/dasboard/details/details.component';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NzCardModule, DetailsComponent, CommonModule, NzModalModule, ProgressBarComponent],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  solicitudes: any[] = [
    { 
      id: 2850494, 
      title: 'Informacion de solicitud 1', 
      status: 'En revisión', 
      creditType: 'Personal',
      term: 12,
      guarantee: 'propertie',
      guaranteeValue: 50000,
      children: 2,
      dependents: 1,
      properties: 'casa',
      housingType: 'propia',
      position: 'asalariado',
      ocupation: 'Ingeniero',
      anualIncome: 60000
    },
    { 
      id: 2850495, 
      title: 'Informacion de solicitud 2', 
      status: 'Aprobada', 
      creditType: 'Hipotecario',
      term: 24,
      guarantee: 'noGuarantee',
      guaranteeValue: null,
      children: 0,
      dependents: 0,
      properties: 'terreno',
      housingType: 'rentada',
      position: 'manager',
      ocupation: 'Gerente de ventas',
      anualIncome: 80000
    },
    { 
      id: 2850496, 
      title: 'Informacion de solicitud 3', 
      status: 'Rechazada', 
      creditType: 'Automotriz',
      term: 36,
      guarantee: 'noGuarantee',
      guaranteeValue: null,
      children: 1,
      dependents: 2,
      properties: 'ambos',
      housingType: 'prestada',
      position: 'asalariado',
      ocupation: 'Mecánico',
      anualIncome: 35000
    },
    { 
      id: 2850497, 
      title: 'Informacion de solicitud 4', 
      status: 'Enviada', 
      creditType: 'Comercial',
      term: 48,
      guarantee: 'propertie',
      guaranteeValue: 100000,
      children: 3,
      dependents: 4,
      properties: 'terreno',
      housingType: 'propia',
      position: 'manager',
      ocupation: 'Administrador de empresas',
      anualIncome: 100000
    },
  ];

  constructor(private modal: NzModalService) {}

  showDetails(solicitud: any): void {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: 'Detalles de la solicitud',
      nzContent: DetailsComponent,
      nzFooter: null,
      nzWrapClassName: 'custom-modal'  // Apply custom class
    });

    if (modalRef.componentInstance) {
      modalRef.componentInstance.solicitud = solicitud;
    }
  }

  calculateProgress(status: string): number {
    switch (status) {
      case 'Enviada':
        return 33;
      case 'En revisión':
        return 66;
      case 'Aprobada':
      case 'Rechazada':
        return 100;
      default:
        return 0;
    }
  }
}
