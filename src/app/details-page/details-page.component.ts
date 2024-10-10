import { Component } from '@angular/core';
import { NavBarComponent } from '../misc/navBar/nav-bar/nav-bar.component'; 
import axios from 'axios';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [NavBarComponent,],
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css'
})
export class DetailsPageComponent {
  ngOnInit(){
    
  }
  async login() {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
        email: "usiel@gmail.com",
        password: "password91"
      });
      console.log('Login successful:', response.data);
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

}
