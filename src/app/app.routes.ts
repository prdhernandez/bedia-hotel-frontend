import { Routes } from '@angular/router';
import { DestinationList } from './features/destinations/components/destination-list/destination-list'
import { DummyComponent } from './shared/components/dummy/dummy';

export const routes: Routes = [
  { path: '', redirectTo: 'destinations', pathMatch: 'full' },
  { path: 'destinations', component: DestinationList},
  { path: 'home', component: DummyComponent },
  { path: 'hotels', component: DummyComponent },
  { path: 'rrhh', component: DummyComponent },
  { path: 'users', component: DummyComponent },
  { path: '**', redirectTo: 'destinations' }
];
