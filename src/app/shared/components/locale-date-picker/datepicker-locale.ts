import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, computed, inject, signal} from '@angular/core';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {MatButtonModule} from '@angular/material/button';
import {DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerIntl, MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import 'moment/locale/es';

/** @title Datepicker with different locale */
@Component({
  selector: 'datepicker-locale',
  templateUrl: 'datepicker-locale.html',
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},

    // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
    // to your app config. We provide it at the component level here, due to limitations
    // of our example generation script.
    provideMomentDateAdapter(),
  ],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerLocale {
  @Input() value: Date | null = null;
  @Output() valueChange = new EventEmitter<Date | null>();

  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  private readonly _intl = inject(MatDatepickerIntl);
  private readonly _locale = signal(inject<unknown>(MAT_DATE_LOCALE));
  
  onDateChange(event: any) {
    this.valueChange.emit(event.value);
  }
}
