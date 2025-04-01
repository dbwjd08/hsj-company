import { Range } from 'react-range';
import { formatPrice } from '@/lib/utils';

export enum Direction {
  Right = 'to right',
  Left = 'to left',
  Down = 'to bottom',
  Up = 'to top',
}
interface ITrackBackground {
  min: number;
  max: number;
  values: number[];
  colors: string[];
  direction?: Direction;
  rtl?: boolean;
}

const RangeBar = ({
  max,
  value,
  onHandle,
  color,
  step,
}: {
  max: number;
  value: any;
  onHandle: any;
  color: string;
  step: number;
}) => {
  const getTrackBackground = ({
    values,
    colors,
    min,
    max,
    direction = Direction.Right,
    rtl = false,
  }: ITrackBackground) => {
    if (rtl && direction === Direction.Right) {
      direction = Direction.Left;
    } else if (rtl && Direction.Left) {
      direction = Direction.Right;
    }
    // sort values ascending
    const progress = values
      .slice(0)
      .sort((a, b) => a - b)
      .map((value) => ((value - min) / (max - min)) * 100);
    const middle = progress.reduce(
      (acc, point, index) =>
        `${acc}, ${colors[index]} ${point}%, ${colors[index + 1]} ${point}%`,
      '',
    );
    return `linear-gradient(${direction}, ${colors[0]} 0%${middle}, ${
      colors[colors.length - 1]
    } 100%)`;
  };
  return (
    <Range
      values={[Number(value)]}
      step={step}
      max={max}
      rtl={false}
      onChange={(value) => onHandle(Number(value))}
      renderTrack={({ props, children }) => (
        <div
          onMouseDown={props.onMouseDown}
          onTouchStart={props.onTouchStart}
          style={{
            ...props.style,
            height: '36px',
            display: 'flex',
            width: '75%',
          }}
        >
          <div
            ref={props.ref}
            style={{
              height: '15px',
              width: '100%',
              borderRadius: '20px',
              background: getTrackBackground({
                values: [Number(value)],
                colors: [color, '#e6e6e6'],
                min: 0,
                max: max,
                rtl: false,
              }),
              alignSelf: 'center',
            }}
          >
            {children}
          </div>
        </div>
      )}
      renderThumb={({ props, isDragged }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: '25px',
            width: '25px',
            borderRadius: '4px',
            backgroundColor: '#FFF',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0px 2px 6px #AAA',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-42px',
              width: '95px',
              color: '#fff',
              fontWeight: 'semibold',
              fontSize: '13px',
              textAlign: 'center',
              borderRadius: '10px',
              backgroundColor: color,
            }}
          >
            {formatPrice(Math.ceil((value * 10 ** 4) / 10000) * 10000)}
          </div>{' '}
          <div
            style={{
              position: 'absolute',
              top: '-15px',
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: `8px solid ${color}`,
            }}
          />
          <div
            style={{
              height: '16px',
              width: '5px',
              backgroundColor: isDragged ? color : '#CCC',
            }}
          />
        </div>
      )}
    />
  );
};

export default RangeBar;
