export const ExponentialFixedStrategy = 'exponentialFixed';

type ExponentialSegment = {
  attemptsMade: number;
  waitingTime: number;
};

const DefaultSegment: ExponentialSegment = {
  attemptsMade: 0,
  waitingTime: 20 * 1000,
};

export const Segments: ExponentialSegment[] = [
  DefaultSegment,
  {
    attemptsMade: 18,
    waitingTime: 5 * 60 * 1000,
  },
  {
    attemptsMade: 36,
    waitingTime: 10 * 60 * 1000,
  },
  {
    attemptsMade: 20,
    waitingTime: 15 * 60 * 1000,
  },
  {
    attemptsMade: 2855,
    waitingTime: -1,
  },
];

const exponentialFixedBackOffStrategy = (attemptsMade: number | undefined) => {
  attemptsMade = attemptsMade || 0;
  let waitingTime = DefaultSegment.waitingTime;
  let attemptsCounter = DefaultSegment.attemptsMade;
  for (const segment of Segments) {
    attemptsCounter += segment.attemptsMade;
    if (attemptsMade > attemptsCounter) {
      waitingTime = segment.waitingTime;
    }
  }

  return waitingTime;
};

export const backoffStrategies = (
  attemptsMade: number | undefined,
  type: string | undefined,
) => {
  switch (type) {
    case ExponentialFixedStrategy: {
      return exponentialFixedBackOffStrategy(attemptsMade);
    }
    default: {
      throw new Error('invalid type');
    }
  }
};
