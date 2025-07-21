// nav-bar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, NzLayoutModule, NzMenuModule, NzIconModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  userType: 'requester' | 'analyst' | 'supervisor' = 'requester';
  isCollapsed = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.userType = this.getUserTypeFromStorage();
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
    }
  }

  getUserTypeSpanish(): string {
    switch(this.userType) {
      case 'requester':
        return 'Solicitante';
      case 'analyst':
        return 'Analista';
      case 'supervisor':
        return 'Supervisor';
      default:
        return '';
    }
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  getUserTypeFromStorage(): 'requester' | 'analyst' | 'supervisor' {
    if (typeof window === 'undefined') return 'requester';

    const rawType = localStorage.getItem('typeUser');
    if (!rawType) return 'requester';

    try {
      const parsed = JSON.parse(rawType);
      const userType = parsed._value || parsed;
      if (userType === 'analyst' || userType === 'supervisor' || userType === 'requester') {
        return userType;
      }
      return 'requester';
    } catch {
      if (rawType === 'analyst' || rawType === 'supervisor' || rawType === 'requester') {
        return rawType;
      }
      return 'requester';
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
