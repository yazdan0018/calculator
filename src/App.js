import './styles.css';
import { useReducer } from 'react';
import DigitalButton from './DigitalButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
};

function reducer (state, {type, payload}) {
  switch (type) {
    case ACTIONS.ADD_DIGIT :
      if(payload.digit === '0' && state.currentOperand === '0') return state
      if(payload.digit === '.' && state.currentOperand.includes('.')) return state
      if(state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }

    case ACTIONS.CLEAR :
      return {}

    case ACTIONS.CHOOSE_OPERATION :
      if(state.currentOperand == null && state.previousOperand == null) return state
      if(state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if(state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.EVALUATE :
      if(state.operation == null || state.previousOperand == null || state.currentOperand == null) return state
      return {
        ...state,
        overwrite: true,
        operation: null,
        previousOperand: null,
        currentOperand: evaluate(state)
      }

    case ACTIONS.DELETE_DIGIT :
      if(state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null) return state
      if(state.currentOperand.length === 1) return {...state, currentOperand: null}
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
  }
}

function evaluate ({currentOperand, previousOperand, operation}) {
  let prev = parseFloat(previousOperand)
  let curr = parseFloat(currentOperand)
  if(isNaN(currentOperand) || isNaN(previousOperand)) return '';
  let computation = '';
  switch (operation) {
    case '+' :
      computation = prev + curr
      break
    case '-' :
      computation = prev - curr
      break
    case '*' :
      computation = prev * curr
      break
    case '/' :
      computation = prev / curr
      break
  }
  return computation.toString()
}

function App () {
  const [{previousOperand, currentOperand, operation}, dispatch] = useReducer(reducer, {});
  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-operand'>{previousOperand} {operation}</div>
        <div className='currant-operand'>{currentOperand}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton dispatch={dispatch} operation='/'/>
      <DigitalButton dispatch={dispatch} digit='1'/>
      <DigitalButton dispatch={dispatch} digit='2'/>
      <DigitalButton dispatch={dispatch} digit='3'/>
      <OperationButton dispatch={dispatch} operation='*'/>
      <DigitalButton dispatch={dispatch} digit='4'/>
      <DigitalButton dispatch={dispatch} digit='5'/>
      <DigitalButton dispatch={dispatch} digit='6'/>
      <OperationButton dispatch={dispatch} operation='+'/>
      <DigitalButton dispatch={dispatch} digit='7'/>
      <DigitalButton dispatch={dispatch} digit='8'/>
      <DigitalButton dispatch={dispatch} digit='9'/>
      <OperationButton dispatch={dispatch} operation='-'/>
      <DigitalButton dispatch={dispatch} digit='0'/>
      <DigitalButton dispatch={dispatch} digit='.'/>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
