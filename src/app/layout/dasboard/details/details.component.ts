import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from 'angular-web-storage';
import { ChatComponent } from '../../../misc/cards/chat/chat.component';
import { DetailsPageComponent } from '../../../details-page/details-page.component';
import { Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SolicitudService } from '../../../services/solicitud.service';
import axios from 'axios';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent, DetailsPageComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @Input() modalRef?: NzModalRef;
  @Input() solicitud: any;
  @Output() closeDrawer: EventEmitter<boolean> = new EventEmitter<boolean>();

  isAdmin: boolean = false;
  isAnalyst: boolean = false;
  isSupervisor: boolean = false;

  selectedAnalyst: string = '';
  analysts: { sub: string; name: string; type:string }[] = [];
  selectedAnalystId: string = '';

  userTypeFromStorage: 'requester' | 'analyst' | 'supervisor' = 'requester';

  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private solicitudService: SolicitudService
  ) {}

  ngOnInit(): void {
    console.log('Solicitud recibida en DetailsComponent:', this.solicitud);

    this.userTypeFromStorage = this.getUserTypeFromStorage();
    this.checkUserType();

    if (this.isSupervisor) {
      this.fetchAnalistas().then(() => {
        this.selectedAnalystId = this.solicitud?.supervisor_id || this.solicitud?.analyst_id || '';
      });
    }
  }

  getUserTypeFromStorage(): 'requester' | 'analyst' | 'supervisor' {
    const rawType = localStorage.getItem('typeUser');
    if (!rawType) return 'requester';

    try {
      const parsed = JSON.parse(rawType);
      const userType = parsed._value || parsed || 'requester';
      if (userType === 'analyst' || userType === 'supervisor' || userType === 'requester') {
        return userType;
      } else {
        return 'requester';
      }
    } catch {
      if (rawType === 'analyst' || rawType === 'supervisor' || rawType === 'requester') {
        return rawType;
      }
      return 'requester';
    }
  }

  async fetchAnalistas(): Promise<void> {
    try {
      const rawToken = localStorage.getItem('accessToken');
      let token = '';
      let decoded: any = null;

      if (rawToken) {
        try {
          const parsed = JSON.parse(rawToken);
          token = parsed._value || '';
        } catch (e) {
          token = rawToken;
        }
        const payload = token.split('.')[1];
        decoded = JSON.parse(atob(payload));
      }

      const response = await axios.get('http://localhost:3006/api/v1/staff/analyst/all', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data.data || [];
      this.analysts = data.map((analyst: any) => ({
        sub: analyst.sub || '',
        name: analyst.name || analyst.full_name || 'Analista',
        type: 'analyst'
      }));
      if (decoded?.sub && decoded['name']) {
        const yaExiste = this.analysts.some(a => a.sub === decoded.sub);
        if (!yaExiste) {
          this.analysts.unshift({
            sub: decoded.sub,
            name: decoded['name'],
            type: 'supervisor'
          });
        }
      }

      console.log('Analistas cargados:', this.analysts);
    } catch (error) {
      console.error('Error al obtener analistas:', error);
    }
  }

  async assignAnalyst(): Promise<void> {
    const seleccionado = this.analysts.find(a => a.sub === this.selectedAnalystId);
    if (!seleccionado) {
      console.warn('Analista no encontrado');
      return;
    }

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

    const id = this.solicitud?.id;
    const url = `http://localhost:3002/api/v1/requests/${id}`;

    const body =
      seleccionado.type === 'supervisor'
        ? { supervisor_id: seleccionado.sub, status: 2 }
        : { analyst_id: seleccionado.sub };

    try {
      const response = await axios.patch(url, body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Asignación exitosa:', response.data);
    } catch (error) {
      console.error('Error al asignar analista/supervisor:', error);
    }
  }

  checkUserType(): void {
    const userType = this.localStorage.get('typeUser');
    this.isAnalyst = userType === 'analyst';
    this.isSupervisor = userType === 'supervisor';
    this.isAdmin = userType === 'admin'; 

    console.log('User type:', userType, {
      isAnalyst: this.isAnalyst,
      isSupervisor: this.isSupervisor,
      isAdmin: this.isAdmin
    });
  }

  details(): void {
    this.solicitudService.setSolicitud(this.solicitud);
    this.closeDrawer.emit(true);
    this.modalRef?.destroy();
    this.router.navigate(['/details']);
  }
}
