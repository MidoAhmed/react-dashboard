import { Map } from 'immutable';
import actions from './actions';
import events from '../../containers/Calendar/demoEvents';

const initState = new Map({
  events,
  view: 'month'
});

export default function calendsrReducer(state = initState, action) {
  switch (action.type) {
    case actions.CALENDAR_VIEW:
      return state.set('view', action.view);
    case actions.CALENDAR_EVENTS:
      return state.set('events', action.events);
    default:
      return state;
  }
}
