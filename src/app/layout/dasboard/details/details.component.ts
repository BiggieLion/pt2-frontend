import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage'; 
import { ChatComponent } from '../../../misc/cards/chat/chat.component';
import { DetailsPageComponent } from '../../../details-page/details-page.component';
import { Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ChatComponent, DetailsPageComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @Input() modalRef?: NzModalRef; 
  @Input() solicitud: any;
  @Output() closeDrawer: EventEmitter<boolean> = new EventEmitter<boolean>();
  isAdmin: boolean = false;

  constructor(private localStorage: LocalStorageService, private router: Router) {}

  ngOnInit(): void {
    console.log('Solicitud recibida en DetailsComponent:', this.solicitud);
    this.checkUserType();
  }

  checkUserType(): void {
    const userType = this.localStorage.get('typeUser');
    this.isAdmin = userType === 'admin';
    console.log("User::::", this.isAdmin, userType);
  }

  details(): void {
    this.closeDrawer.emit(true);
    this.modalRef?.destroy(); 
    this.router.navigate(['/details']);
  }
}
