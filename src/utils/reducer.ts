const initialState: cardState = {
  name: { result: '', helperText: '', error: false },
  card: { result: '', helperText: '', error: false },
  exp: { result: '', helperText: '', error: false },
  cvv: { result: '', helperText: '', error: false },
};

const updateResult = (
  state: cardState,
  input: stateTypes,
  value: string
): cardState => {
  const newState = structuredClone(state);
  newState[input].result = value;
  return newState;
};

const throwError = (state: cardState, input: stateTypes, value: string) => {
  const newState = structuredClone(state);
  newState[input].error = true;
  newState[input].helperText = value;
  return newState;
};

const undoError = (state: cardState, input: stateTypes) => {
  const newState = structuredClone(state);
  newState[input].error = false;
  newState[input].helperText = '';
  return newState;
};

const reducer = (state: cardState, action: reducerAction): cardState => {
  switch (action.type) {
    case 'UPDATE_RESULT':
      return updateResult(state, action.payload.field, action.payload.value);
    case 'THROW_ERROR':
      return throwError(state, action.payload.field, action.payload.value);
    case 'UNDO_ERROR':
      return undoError(state, action.payload.field);
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const actions: actionTypes = {
  UNDO_ERROR: (field: stateTypes, value: string) => {
    return { type: 'UNDO_ERROR', payload: { field, value } };
  },
  THROW_ERROR: (field: stateTypes, value: string) => {
    return { type: 'THROW_ERROR', payload: { field, value } };
  },
  UPDATE_RESULT: (field: stateTypes, value: string) => {
    return { type: 'UPDATE_RESULT', payload: { field, value } };
  },
  RESET: (field: stateTypes, value: string) => {
    return { type: 'RESET', payload: { field, value } };
  },
};

export { reducer, initialState, actions };
