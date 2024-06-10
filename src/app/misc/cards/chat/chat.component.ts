import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

interface Message {
  sender: 'user' | 'admin';
  text: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, NzButtonModule], // Asegurarse de importar los módulos necesarios
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @Input() userType: 'user' | 'admin' = 'user';
  messages: Message[] = [];
  newMessage: string = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ sender: this.userType, text: this.newMessage });
      console.log(this.messages)
      this.newMessage = '';
    }
  }
}
