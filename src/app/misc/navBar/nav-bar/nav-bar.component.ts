import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, NzMenuModule], 
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  userType: 'requester' | 'analyst' | 'supervisor' = 'requester';

  constructor(private router: Router) {}

  ngOnInit(): void {
    
      this.userType = this.getUserTypeFromStorage();

      console.log("usuario en bav",this.userType)
    
  }

  getUserTypeFromStorage(): 'requester' | 'analyst' | 'supervisor' {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 'requester'; 
    }

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

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
