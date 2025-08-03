import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { DateFnsModule } from '@angular/material-date-fns-adapter';
import { MAT_DATE_LOCALE,MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDateFormats } from '@angular/material/core';



export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric'
    },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterModule, 
    NavbarComponent,
    DateFnsModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected title = 'bedia-hotel-frontend';
}
