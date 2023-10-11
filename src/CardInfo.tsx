import * as React from 'react';
import CardFormItem from './CardFormItem';
import './CardInfo.css';

interface cardField {
  result: string;
  helperText: string;
  error: boolean;
}

type stateTypes = 'name' | 'card' | 'exp' | 'cvv';

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

const cardNameNumStyle: React.CSSProperties = {
  marginBottom: '1.5em',
};

type actionTypes = {
  [actionType in reducerActionTypes]: (
    field: stateTypes,
    value: string
  ) => reducerAction;
};

const initialState: any = {
  name: { result: '', helperText: '', error: false },
  card: { result: '', helperText: '', error: false },
  exp: { result: '', helperText: '', error: false },
  cvv: { result: '', helperText: '', error: false },
};

const CardInfo = () => {
  const reducer = (state: cardState, action: reducerAction): cardState => {
    const updateResult = (input: stateTypes, value: string): cardState => {
      const newState = structuredClone(state);
      newState[input].result = value;
      return newState;
    };

    const throwError = (input: stateTypes, value: string) => {
      const newState = structuredClone(state);
      newState[input].error = true;
      newState[input].helperText = value;
      return newState;
    };

    const undoError = (input: stateTypes) => {
      const newState = structuredClone(state);
      newState[input].error = false;
      newState[input].helperText = '';
      return newState;
    };

    switch (action.type) {
      case 'UPDATE_RESULT':
        return updateResult(action.payload.field, action.payload.value);
      case 'THROW_ERROR':
        return throwError(action.payload.field, action.payload.value);
      case 'UNDO_ERROR':
        return undoError(action.payload.field);
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);

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

  const processState = ({ name, card, exp, cvv }: cardState) => {
    const { UNDO_ERROR, THROW_ERROR } = actions;
    // name
    if (!name.result.length)
      dispatch(THROW_ERROR('name', 'Enter card holder name'));
    else if (name.error) dispatch(UNDO_ERROR('name', ''));
    // card
    if (!card.result.length)
      dispatch(THROW_ERROR('card', 'Enter credit card number'));
    else if (card.result.length != 16)
      dispatch(THROW_ERROR('card', 'Credit card number must have 16 numbers'));
    else if (card.error) dispatch(UNDO_ERROR('card', ''));
    // exp
    const expArr = exp.result.split('/');
    if (!exp.result.length)
      dispatch(THROW_ERROR('exp', 'Enter expiration date'));
    else if (
      expArr.length != 2 ||
      expArr[0].length != 2 ||
      expArr[1].length != 2
    )
      dispatch(THROW_ERROR('exp', 'Invalid expiration date'));
    else if (exp.error) dispatch(UNDO_ERROR('exp', ''));
    // cvv
    if (!cvv.result.length) dispatch(THROW_ERROR('cvv', 'Enter valid cvv'));
    else if (cvv.result.length != 3)
      dispatch(THROW_ERROR('cvv', 'Invalid cvv'));
    else if (cvv.error) dispatch(UNDO_ERROR('cvv', ''));
  };

  return (
    <div className='card-form'>
      <div className='credit-card'>
        <div className='card-name-num' style={cardNameNumStyle}>
          <CardFormItem
            label='Name On Card'
            helperText={state.name.helperText}
            placeholder={''}
            onChange={(e) => {
              dispatch(actions.UPDATE_RESULT('name', e.target.value));
            }}
            error={state.name.error}
          />
        </div>
        <div className='card-name-num' style={cardNameNumStyle}>
          <CardFormItem
            label='Credit Card Number'
            helperText={state.card.helperText}
            placeholder={'XXXX-XXXX-XXXX-XXXX'}
            onChange={(e) => {
              dispatch(actions.UPDATE_RESULT('card', e.target.value));
            }}
            error={state.card.error}
          />
        </div>
        <div className='exp-cvv'>
          <CardFormItem
            style={{ marginRight: '0.7em' }}
            label='Expiration Date'
            helperText={state.exp.helperText}
            placeholder={'MM/YY'}
            onChange={(e) => {
              dispatch(actions.UPDATE_RESULT('exp', e.target.value));
            }}
            error={state.exp.error}
          ></CardFormItem>
          <CardFormItem
            label='CVV'
            helperText={state.cvv.helperText}
            placeholder={'000'}
            onChange={(e) => {
              dispatch(actions.UPDATE_RESULT('cvv', e.target.value));
            }}
            error={state.cvv.error}
          ></CardFormItem>
        </div>
      </div>
      <button id='card-submit' onClick={() => processState(state)}>
        Submit
      </button>
    </div>
  );
};

export default CardInfo;
