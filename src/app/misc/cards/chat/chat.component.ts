import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

interface Message {
  time: string;
  sender: 'requester' | 'analyst' | 'supervisor';
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
  @Input() userType: 'requester' | 'analyst' | 'supervisor' = 'requester';
  messages: Message[] = [];
  newMessage: string = '';

  constructor() {
    if (!this.userType) {
      this.userType = this.getUserTypeFromStorage();
    }

    this.messages = [
      { time: '10/07/2025 09:01:12', sender: 'requester', text: 'Hola, ¿cómo estás?' },
      { time: '10/07/2025 09:02:00', sender: 'supervisor', text: 'Estoy bien, gracias. ¿En qué puedo ayudarte?' },
      { time: '10/07/2025 09:03:17', sender: 'requester', text: 'Necesito información sobre mi solicitud.' },
      { time: '10/07/2025 09:04:42', sender: 'supervisor', text: 'Claro, ¿podrías darme más detalles?' },
      { time: '10/07/2025 09:05:03', sender: 'requester', text: 'Es la solicitud con el ID 2850494.' }
    ];
  }

  getUserTypeFromStorage(): 'requester' | 'analyst' | 'supervisor' {
    const rawType = localStorage.getItem('typeUser');
    if (!rawType) return 'requester';

    try {
      const parsed = JSON.parse(rawType);
      const type = parsed._value || parsed || rawType;
      if (type === 'requester' || type === 'analyst' || type === 'supervisor') {
        return type;
      }
    } catch {
      if (rawType === 'requester' || rawType === 'analyst' || rawType === 'supervisor') {
        return rawType;
      }
    }
    return 'requester';
  }

  formatTime(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ 
        sender: this.userType, 
        text: this.newMessage,
        time: this.formatTime(new Date())
      });
      this.newMessage = '';
    }
  }
}
