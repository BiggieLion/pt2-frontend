import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../misc/navBar/nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { SolicitudService } from '../services/solicitud.service';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import axios from 'axios';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css'
})
export class DetailsPageComponent implements OnInit {
  solicitud: any = null;
  esfuerzo: number = 0;
  esfuerzoAlto: boolean = false;

  iaResultado: number | null = null;
  iaMensaje: string = '';
  iaColor: string = '';

  constructor(
    private solicitudService: SolicitudService,
      private message: NzMessageService) {}

  ngOnInit(): void {
    this.solicitud = this.solicitudService.getSolicitud();
    console.log('Solicitud recibida en details-page:', this.solicitud);

    if (this.solicitud) {
      const ingresoMensual = this.solicitud.anualIncome / 12;
      const mensualidad = this.solicitud.amount / this.solicitud.term;
      this.esfuerzo = +(mensualidad / ingresoMensual * 100).toFixed(2);
      console.log('Relación de esfuerzo calculada:', this.esfuerzo);

      const tipo = this.solicitud.creditType?.toLowerCase(); 
      const id = this.solicitud.id;
      console.log(this.solicitud.guarantee)
      const tieneGarantia = this.solicitud.guarantee_type != 3;
      const valorGarantia = this.solicitud.guaranteeValue || 0;
      const montoSolicitado = this.solicitud.amount;

      let limite: number;

      if (!tieneGarantia) {
        if (tipo === 'hipotecario') {
          limite = 28;
          console.log('Sin garantía - Hipotecario: límite = 28%');
        } else {
          limite = 35;
          console.log('Sin garantía - Personal o Prendario: límite = 35%');
        }
      } else {
        if (tipo === 'hipotecario') {
          if (valorGarantia >= montoSolicitado) {
            limite = 40;
            console.log('Con garantía - Hipotecario (garantía suficiente): límite = 40%');
          } else {
            limite = 28;
            console.log('Con garantía - Hipotecario (garantía insuficiente): límite = 28%');
          }
        } else if (tipo === 'personal') {
          limite = 40;
          console.log('Con garantía - Personal: límite = 40%');
        } else if (tipo === 'prendario') {
          limite = 45;
          console.log('Con garantía - Prendario: límite = 45%');
        } else {
          limite = 35;
          console.log('Tipo desconocido con garantía: límite por defecto = 35%');
        }
      }

      console.log('Límite aplicado:', limite);
      this.esfuerzoAlto = this.esfuerzo > limite;
      console.log('¿Relación de esfuerzo alta?:', this.esfuerzoAlto);
    }
  }

  getValorCatalogo<T extends Record<string, number>>(catalogo: T, clave: any, fallback: number): number {
    const key = (clave?.toLowerCase() ?? '') as keyof T;
    return catalogo[key] ?? fallback;
  }

  async aprobarSolicitud(): Promise<void> {
    console.log('Solicitud aprobada manualmente');

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

    const id = this.solicitud.id;
    const url = `http://localhost:3002/api/v1/requests/${id}`;

    try {
      const response = await axios.patch(
        url,
        { status: 3 },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      this.message.success('Solicitud aprobada');
      console.log('Respuesta de aprobación:', response.data);
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
    }
  }

  async rechazarSolicitud(): Promise<void> {
    console.log('Solicitud rechazada manualmente');

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

    const id = this.solicitud.id;
    const url = `http://localhost:3002/api/v1/requests/${id}`;

    try {
      const response = await axios.patch(
        url,
        { status: 4 },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Respuesta de rechazo:', response.data);
      this.message.success('Solicitud rechazada');
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
    }
  }
  openInNewTab(url: string): void {
    window.open(url, '_blank');
  }

  procesarIA(): void {
    if (!this.solicitud) return;

    const catalogos = {
      housingType: {
        'propia': 0,
        'rentada': 1,
        'hipotecada': 2,
        'otro': 3
      },
      ocupation: {
        'gerente de ventas': 0,
        'ingeniero': 1,
        'docente': 2,
        'otros': 3
      },
      position: {
        'manager': 0,
        'junior': 1,
        'senior': 2,
        'otros': 3
      }
    };

    const ownRealty = this.solicitud.properties?.toLowerCase().includes('casa') ? 1 : 0;
    const ownCar = this.solicitud.properties?.toLowerCase().includes('auto') ? 1 : 0;

    const CNT_CHILDREN = Number(this.solicitud.children);
    const AMT_INCOME_TOTAL = Number(this.solicitud.anualIncome);
    const CNT_ADULTS = 2;
    const CNT_FAM_MEMBERS = CNT_CHILDREN + CNT_ADULTS;

    const AMT_INCOME_PER_CHILDREN = CNT_CHILDREN > 0 ? +(AMT_INCOME_TOTAL / CNT_CHILDREN).toFixed(2) : 0;
    const AMT_INCOME_PER_FAM_MEMBER = +(AMT_INCOME_TOTAL / CNT_FAM_MEMBERS).toFixed(2);

    const output = {
      relation: [this.esfuerzoAlto ? 1 : 0], 
      FLAG_OWN_CAR: [ownCar],
      FLAG_OWN_REALTY: [ownRealty],
      CNT_CHILDREN: [CNT_CHILDREN],
      AMT_INCOME_TOTAL: [AMT_INCOME_TOTAL],
      NAME_INCOME_TYPE: [0],
      NAME_EDUCATION_TYPE: [0],
      NAME_FAMILY_STATUS: [0],
      NAME_HOUSING_TYPE: [
        this.getValorCatalogo(catalogos.housingType, this.solicitud.housingType, 3)
      ],
      DAYS_BIRTH: [12005],
      DAYS_EMPLOYED: [4542],
      OCCUPATION_TYPE: [
        this.getValorCatalogo(catalogos.ocupation, this.solicitud.ocupation, 3)
      ],
      CNT_FAM_MEMBERS: [CNT_FAM_MEMBERS],
      CNT_ADULTS: [CNT_ADULTS],
      AMT_INCOME_PER_CHILDREN: [AMT_INCOME_PER_CHILDREN],
      AMT_INCOME_PER_FAM_MEMBER: [AMT_INCOME_PER_FAM_MEMBER]
    };

    console.log('Datos para IA:', output);

    const resultadoIA = Math.floor(Math.random() * 101);
    this.iaResultado = resultadoIA;

    if (resultadoIA < 40) {
      this.iaMensaje = 'Solicitud Rechazada';
      this.iaColor = '#cc0000';
    } else if (resultadoIA < 60) {
      this.iaMensaje = 'Solicitud a revisión manual, por favor tome las medidas necesarias...';
      this.iaColor = '#b97800';
    } else {
      this.iaMensaje = 'Solicitud Aprobada';
      this.iaColor = '#2a8f2a';
    }
  }
}
