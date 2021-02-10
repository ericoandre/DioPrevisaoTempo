import { ApplicationRef, Component, ComponentFactoryResolver, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { PortalOutlet, DomPortalOutlet, ComponentPortal } from '@angular/cdk/portal';

import { select, Store } from '@ngrx/store';
import { Observable, Subject, combineLatest  } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import * as fromHomeAction from  '../../state/home.actions';
import * as fromHomeSelect from  '../../state/home.selectors';
import * as fromBookmarksSelectors from '../../../bookmarks/state/bookmarks.selectors';
import * as fromConfigSelectors from '../../../../shared/state/config/config.selectors';

import { CityWeather } from './../../../../shared/models/weather.model';
import { Bookmark } from './../../../../shared/models/bookmark.model';
import { CityTypeaheadItem } from 'src/app/shared/models/city-typeahead-item.model';
import { UnitSelectorComponent } from '../unit-selector/unit-selector.component';
import { Units } from 'src/app/shared/models/units.enum';

@Component({
  selector: 'dio-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

  cityWeather: CityWeather;

  cityWeather$: Observable<CityWeather>;
  loading$: Observable<boolean>;
  error$: Observable<boolean>;

  unit$: Observable<Units>;

  bookmarksList$: Observable<Bookmark[]>;
  isCurrentFavorite$: Observable<boolean>;

  pesquisahomeControl: FormControl;
  pesquisahomeControlWithAutocomplete: FormControl;

  private componentDestroyed$ = new Subject();

  private portalOutlet: PortalOutlet;

  constructor(
    private store: Store,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector) { }

  ngOnInit(){
    this.pesquisahomeControl = new FormControl('', Validators.required);
    this.pesquisahomeControlWithAutocomplete = new FormControl(undefined);

    this.pesquisahomeControlWithAutocomplete.valueChanges.pipe(takeUntil(this.componentDestroyed$))
    .subscribe((value: CityTypeaheadItem) => {
      if (value) {
        this.store.dispatch(fromHomeAction.loadCurrentWeatherById({id: value.geonameid.toString()}));
      }
    });


    this.cityWeather$ = this.store.pipe(select(fromHomeSelect.selectCurrentWeather));

    this.cityWeather$.pipe(
      takeUntil(this.componentDestroyed$),
    ).subscribe(value=> this.cityWeather = value);

    this.loading$ = this.store.pipe(select(fromHomeSelect.selectCurrentWeatherLoading));
    this.error$ = this.store.pipe(select(fromHomeSelect.selectCurrentWeatherError));

    this.bookmarksList$ = this.store.pipe(select(fromBookmarksSelectors.selectBookmarksList));

    this.isCurrentFavorite$ = combineLatest([this.cityWeather$, this.bookmarksList$])
      .pipe(
        map(([current, bookmarksList]) => {
          if (current) {
            return bookmarksList.some(bookmark => bookmark.id === current.city.id);
          }
          return false;
        }),
      );

      this.unit$ = this.store.pipe(select(fromConfigSelectors.selectUnitConfig));
      this.setupPortal();
  }
  ngOnDestroy(){
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
    this.store.dispatch(fromHomeAction.clearHomeState());
    this.portalOutlet.detach();
  }

  doSearch() {
    const query: string = this.pesquisahomeControl.value;
    this.store.dispatch(fromHomeAction.loadCurrentWeather({ query }));
  }

  ontoggleBookmark(){
    const bookmark = new Bookmark();
    bookmark.id = this.cityWeather.city.id;
    bookmark.name = this.cityWeather.city.name;
    bookmark.country = this.cityWeather.city.country;
    bookmark.coord = this.cityWeather.city.coord;
    this.store.dispatch(fromHomeAction.toggleBookmark({entity:bookmark}));
  }

  private setupPortal(){
    const el = document.querySelector('.navbar-portal-outlet');
    this.portalOutlet = new DomPortalOutlet(
      el,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );
    this.portalOutlet.attach(new ComponentPortal(UnitSelectorComponent));
  }
}
