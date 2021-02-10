import { createAction, props } from "@ngrx/store";
import { Bookmark } from './../../../shared/models/bookmark.model';

export const loadCurrentWeatherById = createAction(
  '[Home] Load Current Weather By Id',
  props<{ id: string }>(),
);


export const loadCurrentWeather = createAction(
  '[Home] load Current Weather',
  props<{query:string}>()
);

export const loadCurrentWeatherSuccess = createAction(
  '[Weather API] load Current Weather Success',
  props<{ entity: any}>()
);

export const loadCurrentWeatherFalure = createAction(
  '[Weather API] load Current Weather Falure',
);


export const toggleBookmark = createAction(
  '[Home] Toggle Bookmark',
  props<{ entity: Bookmark}>()
);

export const clearHomeState = createAction('[Home] Clear Home State');
