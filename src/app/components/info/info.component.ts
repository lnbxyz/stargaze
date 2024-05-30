import { Component, signal } from '@angular/core';

@Component({
  selector: 's-info',
  standalone: true,
  templateUrl: 'info.component.html',
  styleUrl: 'info.component.scss',
})
export class InfoComponent {
  headlines = [
    'is a venn diagram for stars',
    'helps you find crossovers',
    'is an actor spotting tool',
  ];
  headline = signal(
    this.headlines[Math.floor(Math.random() * this.headlines.length)]
  );
}
