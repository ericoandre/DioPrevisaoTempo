import { Action, createReducer, on } from "@ngrx/store";
import * as fromHomeAction from  './home.actions';

export interface HomeState{
  entity:any,
  loading:boolean,
  error:boolean
}

export const homeInitialState: HomeState = {
  entity: undefined,
  loading: false,
  error: false
}
const reducer = createReducer(
  homeInitialState,
  on(fromHomeAction.clearHomeState, () => homeInitialState),
  on(fromHomeAction.loadCurrentWeather, state =>({
    ...state,
    loading: true,
    error: false
  })),
  on(fromHomeAction.loadCurrentWeatherSuccess, (state, {entity})=>({
    ...state,
    entity,
    loading:false
  })),
  on(fromHomeAction.loadCurrentWeatherFalure,state =>({
    ...state,
    loading: false,
    error: true
  }))
);

export function homeReducer(state:HomeState | undefined, action: Action):HomeState{
  return reducer(state, action);
}
