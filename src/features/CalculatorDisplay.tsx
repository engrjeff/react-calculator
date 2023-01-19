import { useEffect, useRef, CSSProperties } from 'react';
import { useCalculator, useCalculatorDispatch } from './CalculatorContext';
import { formatDisplayValue } from './helpers';

function CalculatorDisplay() {
  const { displayValue, displayValueScale } = useCalculator();
  const dispatch = useCalculatorDispatch();

  const displayContainerRef = useRef<HTMLDivElement>(null);

  const scaleStyle: CSSProperties = {
    transform: `scale(${displayValueScale},${displayValueScale})`,
  };

  useEffect(() => {
    if (!displayContainerRef.current) return;

    const parent = displayContainerRef.current.parentNode as HTMLDivElement;

    if (!parent) return;

    const availableWidth = parent.offsetWidth;
    const actualWidthOfDisplayValue = displayContainerRef.current.offsetWidth;
    const actualScaleNeeded = availableWidth / actualWidthOfDisplayValue;

    if (displayValueScale === actualScaleNeeded) return;

    if (actualScaleNeeded < 1) {
      dispatch({ type: 'SET_DISPLAY_SCALE', scale: actualScaleNeeded });
    } else if (displayValueScale < 1) {
      dispatch({ type: 'SET_DISPLAY_SCALE', scale: 1 });
    }
  }, [displayValue]);

  const formattedValue = formatDisplayValue(displayValue);

  return (
    <div className='calculator-display'>
      <div ref={displayContainerRef} className='auto-scaling-text' style={scaleStyle}>
        {formattedValue}
      </div>
    </div>
  );
}

export default CalculatorDisplay;
