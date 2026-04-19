import { Component, signal } from '@angular/core';
import { MainPage } from './main-page/main-page';

@Component({
  selector: 'app-root',
  imports: [MainPage],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('home-app');
}
