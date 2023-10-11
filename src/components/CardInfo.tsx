import * as React from 'react';
import CardFormItem from './CardFormItem';
import './CardInfo.css';
import { reducer, initialState, actions } from '../utils/reducer';

const CardInfo = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
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
    else {
      let status: number;
      fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardData: card.result }),
      })
        .then((response) => {
          status = response.status;
          return response.json();
        })
        .then(({ result }) => {
          if (status === 200) {
            console.log(result);
            dispatch(UNDO_ERROR('card', ''));
          } else {
            dispatch(THROW_ERROR('card', result));
          }
        })
        .catch(() => {
          dispatch(
            THROW_ERROR('card', 'Error: failed to process credit card number')
          );
        });
    }
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
        <div className='card-name-num'>
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
        <div className='card-name-num'>
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
