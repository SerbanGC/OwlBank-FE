import { Component } from '@angular/core';
import { Header } from '../header/header';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-page',
  imports: [Header, MatSidenavModule, MatIconModule, MatDividerModule, MatButtonModule, MatCheckboxModule, FormsModule, MatButtonModule, MatDividerModule, MatIconModule, RouterModule],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {
  events: string[] = [];
  opened = false;
  shouldRun = true;

  handleEvent(event: boolean, sidenav: any) {
    sidenav.toggle()
  }
}
