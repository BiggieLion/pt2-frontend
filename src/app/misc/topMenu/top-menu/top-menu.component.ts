import { Component } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [ NzMenuModule],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.css'
})
export class TopMenuComponent {

}
