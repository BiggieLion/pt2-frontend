import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { DetailsComponent } from '../../../layout/dasboard/details/details.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NgChartsModule } from 'ng2-charts';
import { ChartData } from 'chart.js';

type Estado = 'Enviada' | 'En revisión' | 'Aprobada' | 'Rechazada';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NzCardModule, DetailsComponent, CommonModule, NzModalModule, ProgressBarComponent, NgChartsModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  solicitudes: any[] = [
    { 
      id: 2850494, 
      title: 'Informacion de solicitud 1', 
      status: 'En revisión', 
      creditType: 'Personal',
      term: 12,
      requestedAmount: 30000,
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
      creditType: 'Personal',
      term: 24,
      requestedAmount: 40000,
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
      creditType: 'Prendario',
      term: 36,
      requestedAmount: 15000,
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
      creditType: 'Personal',
      term: 48,
      requestedAmount: 75000,
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

  pieLabels: Estado[] = ['Enviada', 'En revisión', 'Aprobada', 'Rechazada'];

  pieData: ChartData<'pie', number[], Estado> = {
    labels: this.pieLabels,
    datasets: [{ data: [] }]
  };

  barData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Solicitudes' }]
  };

  modalRef?: NzModalRef;

  isBrowser = false;

  constructor(private modal: NzModalService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.generarDatosGraficas();
    }
  }

generarDatosGraficas(): void {
  const estados: Record<Estado, number> = {
    'Enviada': 0,
    'En revisión': 0,
    'Aprobada': 0,
    'Rechazada': 0
  };
  const creditos: { [tipo: string]: number } = {};

  this.solicitudes.forEach(s => {
    const status = s.status as Estado;
    if (this.pieLabels.includes(status)) {
      estados[status]++;
    }
    if (s.creditType) {
      creditos[s.creditType] = (creditos[s.creditType] || 0) + 1;
    }
  });

  this.pieData = {
    labels: this.pieLabels,
    datasets: [{
      data: Object.values(estados),
      backgroundColor: [
        '#6CB3DD', 
        '#527C96', 
        '#619100', 
        '#AD0019'  
      ],
      borderColor: '#fff',
      borderWidth: 1
    }]
  };

  this.barData = {
    labels: Object.keys(creditos),
    datasets: [{
      data: Object.values(creditos),
      label: 'Solicitudes',
      backgroundColor: '#FF9E9B' 
    }]
  };
}


  showDetails(solicitud: any): void {
    this.modalRef = this.modal.create({
      nzTitle: 'Detalles de la solicitud',
      nzContent: DetailsComponent,
      nzFooter: null,
      nzWrapClassName: 'custom-modal'
    });
    this.modalRef.componentInstance!.solicitud = solicitud;
    this.modalRef.componentInstance!.modalRef = this.modalRef;
  }

  destroyModal(): void {
    this.modalRef?.destroy();
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
