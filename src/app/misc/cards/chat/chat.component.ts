import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

interface Message {
  sender: 'user' | 'admin';
  text: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, NzButtonModule], 
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @Input() userType: 'user' | 'admin' = 'user';
  messages: Message[] = [];
  newMessage: string = '';

  constructor() {
    this.messages = [
      { sender: 'user', text: 'Hola, ¿cómo estás?' },
      { sender: 'admin', text: 'Estoy bien, gracias. ¿En qué puedo ayudarte?' },
      { sender: 'user', text: 'Necesito información sobre mi solicitud.' },
      { sender: 'admin', text: 'Claro, ¿podrías darme más detalles?' },
      { sender: 'user', text: 'Es la solicitud con el ID 2850494.' }
    ];
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ sender: this.userType, text: this.newMessage });
      console.log(this.messages);
      this.newMessage = '';
    }
  }
}
