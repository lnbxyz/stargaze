import { Component, signal } from '@angular/core';

@Component({
  selector: 's-title',
  standalone: true,
  templateUrl: 'title.component.html',
  styleUrl: 'title.component.scss',
})
export class TitleComponent {
  options = [
    'is a venn diagram for stars',
    'helps you find crossovers',
    'is an actor spotting tool',
    'for finding crossed paths',
    'finds hidden connections',
    'something about déjà vu',
    'same faces, different places',
    'hollywood is not that big',
    'wait, i know them from...',
    'something about kevin bacon',
  ];
  splash = signal(
    this.options[Math.floor(Math.random() * this.options.length)]
  );
}
