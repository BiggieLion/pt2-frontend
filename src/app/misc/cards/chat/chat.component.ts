import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import axios from 'axios';

interface Message {
  time: string;
  sender: 'requester' | 'analyst' | 'supervisor';
  text: string;
}
// ... imports iguales

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, NzButtonModule], 
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges {
  @Input() userType: 'requester' | 'analyst' | 'supervisor' = 'requester';
  @Input() chat: Message[] = []; 
  @Input() id: number = 0;
  @Output() messageSent = new EventEmitter<void>();

  localMessages: Message[] = []; 
  newMessage: string = '';

  ngOnInit(): void {
    if (!this.userType) {
      this.userType = this.getUserTypeFromStorage();
    }
    this.localMessages = [...this.chat];
    console.log('🔵 ngOnInit - Chat cargado:', this.localMessages);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chat'] && changes['chat'].currentValue) {
      this.localMessages = [...this.chat]; 
      console.log('🟡 ngOnChanges - Chat actualizado desde padre:', this.localMessages);
    }
  }

async sendMessage(): Promise<void> {
  if (this.newMessage.trim()) {
    const newMsg: Message = {
      sender: this.userType,
      text: this.newMessage,
      time: this.formatTime(new Date())
    };

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

    const url = `http://localhost:3002/api/v1/requests/${this.id}`;

    try {
      await axios.patch(url, { chat: [] }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedChat = [...this.chat, newMsg];

      await axios.patch(url, { chat: updatedChat }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      this.messageSent.emit();
      this.newMessage = '';
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  }
}


  formatTime(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  getUserTypeFromStorage(): 'requester' | 'analyst' | 'supervisor' {
    const rawType = localStorage.getItem('typeUser');
    try {
      const parsed = JSON.parse(rawType || '{}');
      return parsed._value || rawType || 'requester';
    } catch {
      return (rawType as any) || 'requester';
    }
  }
}
