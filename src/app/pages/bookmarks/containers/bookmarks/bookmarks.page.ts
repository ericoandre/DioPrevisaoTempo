import { Component, OnInit, OnDestroy  } from '@angular/core';
import { FormControl } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { Bookmark } from '../../../../shared/models/bookmark.model';
import { CityTypeaheadItem } from '../../../../shared/models/city-typeahead-item.model';

import { BookmarkState } from '../../state/bookmarks.reducer';
import * as fromBookmarksSelectors from '../../state/bookmarks.selectors';
import * as fromBookmarksActions from '../../state/bookmarks.actions';

@Component({
  selector: 'dio-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss']
})
export class BookmarksPage implements OnInit, OnDestroy  {

  bookmarks$: Observable<Bookmark[]>;
  pesquisaAutocomplete: FormControl;

  private componentDestroyed$ = new Subject();

  constructor(private store: Store<BookmarkState>) { }

  ngOnInit() {
    this.bookmarks$ = this.store.pipe(select(fromBookmarksSelectors.selectBookmarksList));

    this.pesquisaAutocomplete = new FormControl(undefined);
    this.pesquisaAutocomplete.valueChanges
    .pipe(takeUntil(this.componentDestroyed$))
    .subscribe((value: CityTypeaheadItem) =>
      this.store.dispatch(fromBookmarksActions.toggleBookmarById({ id: value.geonameid }))
    );
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.unsubscribe();
  }

  removeBookmark(id: number) {
    this.store.dispatch(fromBookmarksActions.removeBookmark({ id }));
  }

}
