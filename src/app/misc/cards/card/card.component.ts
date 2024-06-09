import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DetailsComponent } from '../../../layout/dasboard/details/details.component';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal'; // Importamos NzModalRef también

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NzCardModule, DetailsComponent, CommonModule, NzModalModule, ProgressBarComponent],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  solicitudes: any[] = [
    { id: 2850494, title: 'Informacion de solicitud 1', status: 'En revisión', creditType: 'Personal' },
    { id: 2850495, title: 'Informacion de solicitud 2', status: 'Aprobada', creditType: 'Hipotecario' },
    { id: 2850496, title: 'Informacion de solicitud 3', status: 'Rechazada', creditType: 'Automotriz' },
    { id: 2850497, title: 'Informacion de solicitud 4', status: 'Enviada', creditType: 'Comercial' },
  ];

  constructor(private modal: NzModalService) {}

  showDetails(solicitud: any): void {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: 'Detalles de la solicitud',
      nzContent: DetailsComponent,
      nzFooter: null
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
