import { createReducer, Action, on } from "@ngrx/store";

import { Bookmark } from 'src/app/shared/models/bookmark.model';
import * as fromHomeAction from  '../../home/state/home.actions';
import * as fromBookmarkAction from  './bookmarks.actions';

export interface BookmarkState{
  list: Bookmark[];
}

export const bookmarkInitialState: BookmarkState = {
  list:[]
}

const reducer = createReducer(
  bookmarkInitialState,
  on(fromHomeAction.toggleBookmark, (state, { entity}) =>({
    ...state,
    list: toggleBookmark(state.list, entity)
  })),
  on(fromBookmarkAction.removeBookmark,(state, {id})=>({
    ...state,
    list:state.list.filter(e=>e.id !== id),
  })),
  on(fromBookmarkAction.updateBookmarksList, (state, { list }) => ({
    ...state,
    list,
  })),
)

export const bookmarkReducer = (state: BookmarkState | undefined, action: Action)=>{
  return reducer(state,action);
}

function toggleBookmark(list: Bookmark[], entity: Bookmark): Bookmark[] {
  if(list.find(bookmark => bookmark.id === entity.id)){
    return list.filter(bookmark => bookmark.id !== entity.id);
  }
  return [...list, entity]
}
