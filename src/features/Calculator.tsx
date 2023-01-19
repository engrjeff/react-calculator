import CalculatorButtons from './CalculatorButtons';
import CalculatorProvider from './CalculatorContext';
import CalculatorDisplay from './CalculatorDisplay';
import Title from './Title';

function Calculator() {
  return (
    <CalculatorProvider>
      <div id='wrapper'>
        <Title />
        <div className='calculator'>
          <CalculatorDisplay />
          <CalculatorButtons />
        </div>
      </div>
    </CalculatorProvider>
  );
}

export default Calculator;
