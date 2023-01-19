import { useEffect } from 'react';
import { useCalculator, useCalculatorDispatch, CalculatorState } from './CalculatorContext';
import CalculatorKey from './CalculatorKey';

function CalculatorButtons() {
  const { displayValue } = useCalculator();
  const dispatch = useCalculatorDispatch();

  useEffect(() => {
    document.addEventListener('keydown', handleKeyEvents);

    return () => {
      document.removeEventListener('keydown', handleKeyEvents);
    };
  }, []);

  const hasNoDiplay = displayValue === '0';
  const clearButtonText = hasNoDiplay ? 'AC' : 'C';

  function handleDigitInput(digit: string) {
    dispatch({ type: 'INPUT_DIGIT', digit });
  }

  function handlePlusMinus() {
    dispatch({ type: 'TOGGLE_SIGN' });
  }

  function handlePercent() {
    dispatch({ type: 'INPUT_PERCENT' });
  }

  function clearDisplay() {
    if (hasNoDiplay) {
      return dispatch({ type: 'CLEAR_ALL' });
    }
    dispatch({ type: 'CLEAR_DISPLAY' });
  }

  function handleDotInput() {
    dispatch({ type: 'INPUT_DOT' });
  }

  function performOperation(nextOperator: CalculatorState['operator']) {
    dispatch({ type: 'PERFORM_OPERATOR', nextOperator });
  }

  function clearLastCharacter() {
    dispatch({ type: 'CLEAR_LAST' });
  }

  function handleKeyEvents(event: KeyboardEvent) {
    let { key } = event;

    if (key === 'Enter') key = '=';

    if (/\d/.test(key)) {
      event.preventDefault();
      handleDigitInput(key);
    } else if (['+', '-', '/', '*', '='].includes(key)) {
      event.preventDefault();
      performOperation(key as CalculatorState['operator']);
    } else if (key === '.') {
      event.preventDefault();
      handleDotInput();
    } else if (key === '%') {
      event.preventDefault();
      handlePercent();
    } else if (key === 'Backspace') {
      event.preventDefault();
      clearLastCharacter();
    } else if (key === 'Clear') {
      event.preventDefault();

      if (displayValue !== '0') {
        clearDisplay();
      } else {
        dispatch({ type: 'CLEAR_ALL' });
      }
    }
  }

  return (
    <div className='calculator-keypad'>
      <div className='input-keys'>
        <div className='function-keys'>
          <CalculatorKey className='key-clear' keyValue={clearButtonText} onPress={clearDisplay} />
          <CalculatorKey className='key-sign' keyValue='±' onPress={handlePlusMinus} />
          <CalculatorKey className='key-percent' keyValue='%' onPress={handlePercent} />
        </div>
        <div className='digit-keys'>
          <CalculatorKey className='key-0' keyValue='0' onPress={handleDigitInput} />
          <CalculatorKey className='key-dot' keyValue='●' onPress={handleDotInput} />
          <CalculatorKey className='key-1' keyValue='1' onPress={handleDigitInput} />
          <CalculatorKey className='key-2' keyValue='2' onPress={handleDigitInput} />
          <CalculatorKey className='key-3' keyValue='3' onPress={handleDigitInput} />
          <CalculatorKey className='key-4' keyValue='4' onPress={handleDigitInput} />
          <CalculatorKey className='key-5' keyValue='5' onPress={handleDigitInput} />
          <CalculatorKey className='key-6' keyValue='6' onPress={handleDigitInput} />
          <CalculatorKey className='key-7' keyValue='7' onPress={handleDigitInput} />
          <CalculatorKey className='key-8' keyValue='8' onPress={handleDigitInput} />
          <CalculatorKey className='key-9' keyValue='9' onPress={handleDigitInput} />
        </div>
      </div>
      <div className='operator-keys'>
        <CalculatorKey className='key-divide' keyValue='÷' onPress={() => performOperation('/')} />
        <CalculatorKey
          className='key-multiply'
          keyValue='×'
          onPress={() => performOperation('*')}
        />
        <CalculatorKey
          className='key-subtract'
          keyValue='-'
          onPress={() => performOperation('-')}
        />
        <CalculatorKey className='key-add' keyValue='+' onPress={() => performOperation('+')} />
        <CalculatorKey className='key-equals' keyValue='=' onPress={() => performOperation('=')} />
      </div>
    </div>
  );
}

export default CalculatorButtons;
