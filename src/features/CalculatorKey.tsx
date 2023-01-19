interface CalculatorKeyProps {
  onPress: (keyValue: string) => void;
  keyValue: string;
  className?: string;
}

function CalculatorKey({ onPress, keyValue, className }: CalculatorKeyProps) {
  return (
    <button onClick={() => onPress(keyValue)} className={[className, 'calculator-key'].join(' ')}>
      {keyValue}
    </button>
  );
}

export default CalculatorKey;
