import { Injectable } from "@angular/core";

import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, mergeMap, catchError } from 'rxjs/operators';

import * as fromHomeAction from  './home.actions';
import { Store } from '@ngrx/store';
import { WeatherService } from './../../../shared/services/weather.service';
import { CityWeather } from "src/app/shared/models/weather.model";

@Injectable()
export class HomeEffects{

  loadCurrentWeather$ = createEffect(()=> this.actions$
    .pipe(
      ofType(fromHomeAction.loadCurrentWeather),
      mergeMap(({query})=> this.weatherService.getCityWeatherByQuery(query)),
      catchError((err, caught$)=>{
        this.store.dispatch(fromHomeAction.loadCurrentWeatherFalure());
        return caught$
      }),
      map((entity:any)=> fromHomeAction.loadCurrentWeatherSuccess({ entity}))
    ),
  );

  loadCurrentWeatherById$ = createEffect(() => this.actions$
  .pipe(
    ofType(fromHomeAction.loadCurrentWeatherById),
    mergeMap(({ id }: { id: string }) => this.weatherService.getCityWeatherById(id)),
    catchError((err, caught$) => {
      this.store.dispatch(fromHomeAction.loadCurrentWeatherFalure());
      return caught$;
    }),map((entity: CityWeather) => fromHomeAction.loadCurrentWeatherSuccess({entity})),
    ));

  constructor(
    private actions$: Actions,
    private store: Store,
    private weatherService: WeatherService
  ){}
}
