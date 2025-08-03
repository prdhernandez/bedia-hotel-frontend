// src/app/shared/components/dummy/dummy.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
   imports: [RouterModule],
  selector: 'app-dummy',
  template: `<div class="dummy-wrapper">
               <h2>Próximamente...</h2>
               <p>Esta sección estará disponible en el futuro.</p>
             </div>`,
  styles: [`
    .dummy-wrapper {
      padding: 4rem;
      text-align: center;
      color: #555;
    }
    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
  `]
})
export class DummyComponent {}
