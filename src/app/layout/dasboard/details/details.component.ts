import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage'; // Importa el servicio de almacenamiento local
import { ChatComponent } from '../../../misc/cards/chat/chat.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ChatComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @Input() solicitud: any;
  isAdmin: boolean = false;

  constructor(private localStorage: LocalStorageService) {}

  ngOnInit(): void {
    console.log('Solicitud recibida en DetailsComponent:', this.solicitud);
    this.checkUserType();
  }

  checkUserType(): void {
    const userType = this.localStorage.get('typeUser');
    this.isAdmin = userType === 'admin';
    console.log("User::::", this.isAdmin, userType);
  }
}
