import { createContext, ReactNode, Dispatch, useContext, useReducer } from 'react';

export interface CalculatorState {
  value: number | null;
  displayValue: string;
  displayValueScale: number;
  operator: '+' | '-' | '/' | '*' | '=' | null;
  operandExists: boolean;
}

type CalculatorActions =
  | { type: 'CLEAR_ALL' }
  | { type: 'CLEAR_DISPLAY' }
  | { type: 'CLEAR_LAST' }
  | { type: 'TOGGLE_SIGN' }
  | { type: 'INPUT_PERCENT' }
  | { type: 'INPUT_DOT' }
  | { type: 'SET_VALUE'; value: string | null }
  | { type: 'INPUT_DIGIT'; digit: string }
  | { type: 'SET_DISPLAY_SCALE'; scale: number }
  | { type: 'PERFORM_OPERATOR'; nextOperator: CalculatorState['operator'] };

const CalculatorContext = createContext<CalculatorState | null>(null);
const CalculatorDispatchContext = createContext<Dispatch<CalculatorActions> | null>(null);

CalculatorContext.displayName = 'CalculatorContext';
CalculatorDispatchContext.displayName = 'CalculatorDispatchContext';

const initialState: CalculatorState = {
  value: null,
  displayValue: '0',
  displayValueScale: 1,
  operator: null,
  operandExists: false,
};

const CalculatorOperations = {
  '/': (prevValue: number, nextValue: number) => prevValue / nextValue,
  '*': (prevValue: number, nextValue: number) => prevValue * nextValue,
  '+': (prevValue: number, nextValue: number) => prevValue + nextValue,
  '-': (prevValue: number, nextValue: number) => prevValue - nextValue,
  '=': (prevValue: number, nextValue: number) => nextValue,
};

const calculatorReducer = (state: CalculatorState, action: CalculatorActions): CalculatorState => {
  switch (action.type) {
    case 'CLEAR_ALL':
      return initialState;
    case 'CLEAR_DISPLAY':
      return { ...state, displayValue: '0' };
    case 'CLEAR_LAST':
      return {
        ...state,
        displayValue: state.displayValue.substring(0, state.displayValue.length - 1) || '0',
      };
    case 'SET_DISPLAY_SCALE':
      return { ...state, displayValueScale: action.scale };
    case 'INPUT_DIGIT': {
      if (state.operandExists) {
        return {
          ...state,
          displayValue: action.digit,
          operandExists: false,
        };
      }
      return {
        ...state,
        displayValue:
          state.displayValue === '0' ? String(action.digit) : state.displayValue + action.digit,
      };
    }
    case 'INPUT_PERCENT': {
      const currentDisplayValue = parseFloat(state.displayValue);
      if (currentDisplayValue === 0) return state;

      const digits = state.displayValue.replace(/^-?\d*\.?/, ''); // remove dots, commas
      const newValue = parseFloat(state.displayValue) / 100;

      return {
        ...state,
        displayValue: String(newValue.toFixed(digits.length + 2)),
      };
    }
    case 'INPUT_DOT': {
      // only add the dot if there isn't one yet
      if (!/\./.test(state.displayValue)) {
        return {
          ...state,
          displayValue: state.displayValue + '.',
          operandExists: false,
        };
      }

      return state;
    }
    case 'TOGGLE_SIGN':
      return {
        ...state,
        displayValue: String(parseFloat(state.displayValue) * -1),
      };
    case 'PERFORM_OPERATOR': {
      const { value, displayValue, operator } = state;
      const inputValue = parseFloat(displayValue);

      let theState = { ...state };

      if (value == null) {
        theState = {
          ...theState,
          value: inputValue,
        };
      } else if (operator) {
        const currentValue = value || 0;
        const newValue = CalculatorOperations[operator](currentValue, inputValue);

        theState = {
          ...theState,
          value: newValue,
          displayValue: String(newValue),
        };
      }

      return {
        ...theState,
        operandExists: true,
        operator: action.nextOperator,
      };
    }
    default:
      return state;
  }
};

const CalculatorProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  return (
    <CalculatorContext.Provider value={state}>
      <CalculatorDispatchContext.Provider value={dispatch}>
        {children}
      </CalculatorDispatchContext.Provider>
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => {
  const calculatorContext = useContext(CalculatorContext);

  if (!calculatorContext)
    throw new Error('useCalculator can only be used inside the Calculator Context');

  return calculatorContext;
};

export const useCalculatorDispatch = () => {
  const calculatorDispatchContext = useContext(CalculatorDispatchContext);

  if (!calculatorDispatchContext)
    throw new Error(
      'useCalculatorDispatch can only be used inside the Calculator Dispatch Context'
    );

  return calculatorDispatchContext;
};

export default CalculatorProvider;
