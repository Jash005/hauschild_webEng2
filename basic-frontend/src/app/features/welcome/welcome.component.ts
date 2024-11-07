import {Component, computed, inject, Input, OnInit, signal} from '@angular/core';
import {ApiService} from "../../shared/services/api.service";
import {Echo} from "../../shared/types/echo.type";
import {FormsModule} from "@angular/forms";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    FormsModule,
    AsyncPipe
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {

  @Input() contains?: string; // URL Query Param

  private apiService = inject(ApiService);

  createInput = '';
  filterInput = signal('');

  allEchos = signal<Echo[]>([]);
  filteredEchos = computed<Echo[]>(() => {
    return this.allEchos().filter(echo => echo.message.includes(this.filterInput()));
  });

  ngOnInit(): void {
    void this.loadEchos();

    if (this.contains) {
      this.filterInput.set(this.contains);
    }
  }

  async addEcho(): Promise<void> {
    const newEcho = await this.apiService.createEcho({
      message: this.createInput
    });
    const newEchoList = [...this.allEchos(), newEcho];
    newEchoList.sort((a, b) => a.message.localeCompare(b.message));
    this.allEchos.set(newEchoList);
  }

  async loadEchos(): Promise<void> {
    const echos = await this.apiService.getEchos();
    echos.sort((a, b) => a.message.localeCompare(b.message));
    this.allEchos.set(echos);
  }

  async error(): Promise<void> {
    try {
      await this.apiService.doError();
      console.log('This will never trigger.')
    } catch (err) {
      console.log('Error caught in Component:', err);
    }
  }
}
