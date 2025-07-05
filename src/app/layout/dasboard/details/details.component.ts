import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from 'angular-web-storage';
import { ChatComponent } from '../../../misc/cards/chat/chat.component';
import { DetailsPageComponent } from '../../../details-page/details-page.component';
import { Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SolicitudService } from '../../../services/solicitud.service';

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
  selectedAnalyst: string = '';
  analysts: string[] = ['Analista 1', 'Analista 2', 'Analista 3'];

  constructor(
    private localStorage: LocalStorageService,
    private router: Router,
    private solicitudService: SolicitudService
  ) {}

  ngOnInit(): void {
    console.log('Solicitud recibida en DetailsComponent:', this.solicitud);
    this.checkUserType();

    if (this.isAdmin) {
      const adminName = this.localStorage.get('nameUser') || 'Administrador';
      if (!this.analysts.includes(adminName)) {
        this.analysts.unshift(adminName);
      }
    }
  }

  checkUserType(): void {
    const userType = this.localStorage.get('typeUser');
    this.isAdmin = userType === 'admin';
    console.log('User type:', userType, '¿Es admin?', this.isAdmin);
  }

  assignAnalyst(): void {
    console.log(`Solicitud ${this.solicitud?.id} asignada a: ${this.selectedAnalyst}`);
  }

  details(): void {
    this.solicitudService.setSolicitud(this.solicitud);
    this.closeDrawer.emit(true);
    this.modalRef?.destroy();
    this.router.navigate(['/details']);
  }
}
