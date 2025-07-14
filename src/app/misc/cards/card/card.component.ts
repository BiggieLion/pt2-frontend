import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { DetailsComponent } from '../../../layout/dasboard/details/details.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NgChartsModule } from 'ng2-charts';
import { ChartData } from 'chart.js';
import axios from 'axios';

type Estado = 'Enviada' | 'En revisión' | 'Aprobada' | 'Rechazada';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NzCardModule, DetailsComponent, CommonModule, NzModalModule, ProgressBarComponent, NgChartsModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  solicitudes: any[] = [];

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
      this.fetchSolicitudes();
    }
  }

  async fetchSolicitudes(): Promise<void> {
    try {
      const rawToken = localStorage.getItem('accessToken');
      const type = localStorage.getItem('typeUser');
      let token = '';
      let userType = '';

      if (rawToken) {
        try {
          const parsed = JSON.parse(rawToken);
          token = parsed._value || '';
        } catch (e) {
          token = rawToken;
        }
      }

      if (type) {
        try {
          const parsed = JSON.parse(type);
          console.log(parsed);
          userType = parsed._value || '';
        } catch (e) {}
      }

      let endpoint = 'http://localhost:3002/api/v1/requests/requester';
      if (userType === 'supervisor') {
        endpoint = 'http://localhost:3002/api/v1/requests/all';
      } else if (userType === 'analyst') {
        endpoint = 'http://localhost:3002/api/v1/requests/analyst';
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const solicitudesCrudas = response.data.data;
      console.log(response.data.data)

      this.solicitudes = solicitudesCrudas.map((s: any) => ({
        ...s,
        statusInt: s.status,
        status: this.convertirEstado(s.status),
        creditType: this.convertirTipoCredito(s.credit_type)
      }));

      this.generarDatosGraficas();
      console.log('Solicitudes obtenidas:', this.solicitudes);
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
    }
  }

  convertirEstado(valor: any): Estado {
    if (valor === 4 || valor === null) return 'Rechazada';
    if (valor === 1 || valor === false) return 'Enviada';
    if (valor === 2) return 'En revisión';
    if (valor === 3 || valor === true) return 'Aprobada';
    return 'Enviada'; 
  }

  convertirTipoCredito(id: number): string {
    switch (id) {
      case 1:
        return 'Personal';
      case 2:
        return 'Hipotecario';
      case 3:
        return 'Prendario';
      default:
        return 'Desconocido';
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
        backgroundColor: [
          '#FF9E9B',
          '#936366',
          '#E84F59'

        ] 
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
