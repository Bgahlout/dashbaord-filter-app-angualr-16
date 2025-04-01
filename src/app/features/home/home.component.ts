import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonComponent], // Import shared components
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

}
