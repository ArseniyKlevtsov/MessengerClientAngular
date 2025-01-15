import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tool-panel',
  standalone: true,
  imports: [],
  templateUrl: './tool-panel.component.html',
  styleUrl: './tool-panel.component.css'
})
export class ToolPanelComponent {
  @Output() optionSelected = new EventEmitter<string>();
  @Output() profileClicked = new EventEmitter<void>();

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.optionSelected.emit(selectElement.value); // Передаем выбранное значение
  }

  onProfileClick(): void {
    this.profileClicked.emit(); // Передаем событие нажатия кнопки
  }
}
