import { Component } from '@angular/core';
import { NavBarComponent } from '../misc/navBar/nav-bar/nav-bar.component'; 

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

}
