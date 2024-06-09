// details.component.ts
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-details',
  standalone: true,
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  @Input() solicitud: any;

  ngOnInit(): void {
    console.log('Solicitud recibida en DetailsComponent:', this.solicitud);
  }
}
