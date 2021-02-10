import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CityWeather } from './../../../../shared/models/weather.model';

import { Units } from 'src/app/shared/models/units.enum';

@Component({
  selector: 'dio-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentWeatherComponent {

  @Input() cityWeather: CityWeather;
  @Input() isFavorite: boolean;
  @Input() unit: Units;
  @Output() toggleBookmark = new EventEmitter();

  get citName():string{
    return `${this.cityWeather.city.name}, ${this.cityWeather.city.country}`;
  }

  ontoggleBookmark(){
    this.toggleBookmark.emit();
  }
}
