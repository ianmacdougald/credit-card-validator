import * as React from 'react';
import CardFormItem from './CardFormItem';
import './CardInfo.css';
import { reducer, initialState, actions } from '../utils/reducer';

const CardInfo = () => {
  // Instantiate useReducer hook with imported reducer and state model
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // Define form submission logic
  const processState = ({ name, card, exp, cvv }: cardState) => {
    // For each element of the cardState (i.e. name, card, exp, cvv), test the validity of the result.
    // 1.0 is it basically valid? If not, dispatch a new state using the THROW_ERROR action creator
    // 2.0 does it meet valid conditions? If not, dispatch a new state using the THROW_ERROR action creator
    // 3.0 otherwise, turn off the error if the input is valid

    // Dereference the two relevant action creators to save typing
    const { UNDO_ERROR, THROW_ERROR } = actions;
    /***** NAME *****/
    // Does the result have a valid input?
    if (!name.result.length)
      // if not, dispatch a new state using the the THROW_ERROR action creator
      dispatch(THROW_ERROR('name', 'Enter card holder name'));
    // otherwise, turn off the error if it's on
    else if (name.error) dispatch(UNDO_ERROR('name', ''));

    /***** CARD *****/
    // Does the result have a valid input?
    if (!card.result.length)
      // if not, dispatch a new state using the the THROW_ERROR action creator
      dispatch(THROW_ERROR('card', 'Enter credit card number'));
    // does it meet the most basic criteria of a credit card (16 digits)?
    else if (card.result.length != 16)
      // if not, dispatch a new state using the the THROW_ERROR action creator
      dispatch(THROW_ERROR('card', 'Credit card number must have 16 numbers'));
    else {
      // otherwise, send the input data to the server to test its validity
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
          // If the status code is 200, turn off the error if it exists
          if (status === 200) {
            // Log the result
            console.log(result);
            if (card.error) dispatch(UNDO_ERROR('card', ''));
            // Otherwise turn the error on with specific information received on the server
          } else {
            dispatch(THROW_ERROR('card', result));
          }
        })
        .catch(() => {
          // If there is an error processing the request, inform the user
          dispatch(
            THROW_ERROR('card', 'Error: failed to process credit card number')
          );
        });
    }

    /***** EXP *****/
    // EXP expects its result to be formatted like so MM/YY
    const expArr = exp.result.split('/');
    // Test to see if the result has input
    if (!exp.result.length)
      dispatch(THROW_ERROR('exp', 'Enter expiration date'));
    // Test to be sure that the formatting is correct
    else if (
      expArr.length != 2 ||
      expArr[0].length != 2 ||
      expArr[1].length != 2
    )
      dispatch(THROW_ERROR('exp', 'Invalid expiration date'));
    else if (exp.error) dispatch(UNDO_ERROR('exp', ''));

    /***** CVV *****/
    // Test to make sure the result field has input
    if (!cvv.result.length) dispatch(THROW_ERROR('cvv', 'Enter valid cvv'));
    // Make sure that it has a length of three
    else if (cvv.result.length != 3)
      dispatch(THROW_ERROR('cvv', 'Invalid cvv'));
    else if (typeof JSON.parse(cvv.result) != 'number')
      dispatch(THROW_ERROR('cvv', 'Invalid cvv'));
    else if (cvv.error) dispatch(UNDO_ERROR('cvv', ''));
  };

  return (
    // Outer div contains the fields + a button
    <div className='card-form'>
      <div className='credit-card'>
        <div className='card-name-num'>
          {/* NAME Item */}
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
        {/* CARD Item */}
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
          {/* EXP Item */}
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
          {/* CVV Item */}
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
      {/* Submit button */}
      <button id='card-submit' onClick={() => processState(state)}>
        Submit
      </button>
    </div>
  );
};

export default CardInfo;
