import { DestinationList } from './features/destinations/components/destination-list/destination-list'

export const routes = [
  { path: 'destinations', component: DestinationList },
  { path: '', component: DestinationList },
  { path: '**', redirectTo: 'destinations' }
];
