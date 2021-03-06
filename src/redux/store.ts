import {
  combineReducers,
  createStore,
  CombinedState,
  applyMiddleware,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import { loadState, saveState } from 'utils/localStorage';
import {
  CardOptionsState,
  CardOptionsActions,
  cardOptionsReducer,
} from './ducks/cardOptions/reducer';

export type RootActions = CardOptionsActions;

export interface RootState {
  cardOptions: CardOptionsState;
}

const rootReducer = combineReducers<RootState>({
  cardOptions: cardOptionsReducer,
});

const composeEnhancers = composeWithDevTools({
  trace: true,
  actionCreators: {},
});

const sagaMiddleware = createSagaMiddleware();

const initialState = loadState();

export const store = createStore<
  CombinedState<RootState>,
  RootActions,
  unknown,
  null
>(rootReducer, initialState, composeEnhancers(applyMiddleware(sagaMiddleware)));

store.subscribe(() => {
  saveState(store.getState());
});

sagaMiddleware.run(rootSaga);
