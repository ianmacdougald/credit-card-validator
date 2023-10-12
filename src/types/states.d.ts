type stateTypes = 'name' | 'card' | 'exp' | 'cvv';

interface cardField {
  result: string;
  helperText: string;
  error: boolean;
}

interface cardState {
  name: cardField;
  card: cardField;
  exp: cardField;
  cvv: cardField;
}

type reducerActionTypes =
  | 'UPDATE_RESULT'
  | 'THROW_ERROR'
  | 'UNDO_ERROR'
  | 'RESET';

interface reducerAction {
  type: reducerActionTypes;
  payload: { field: stateTypes; value: string };
}

type actionTypes = {
  [actionType in reducerActionTypes]: (
    field: stateTypes,
    value: string
  ) => reducerAction;
};
