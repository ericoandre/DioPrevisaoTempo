import { createFeatureSelector, createSelector } from '@ngrx/store';

import { BookmarkState } from './bookmarks.reducer';

export const selectBookmarksState = createFeatureSelector('bookmarks');

export const selectBookmarksList = createSelector(
  selectBookmarksState,
  (bookmarksState: BookmarkState) => bookmarksState.list,
);
