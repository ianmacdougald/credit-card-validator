import express, { Request, Response, NextFunction } from 'express';

// Interfaces
interface ExpressError {
  log: string;
  status: number;
  message: { err: string };
}

// Constants
const app = express();
const PORT = 3000;

// Logic
app.use(express.json());

// luhn checksum
const luhnChecksum = (input: string): number => {
  let result: number = 0;
  let mult2: number = 0;
  // Moving backwards through the number
  for (let i = input.length - 1; i >= 0; i--) {
    // Test the validity of each character (return -1 if invalid character detected)
    let current = parseInt(input[i]);
    if (isNaN(current)) return -1;
    // If on an even step (i.e. on the 'every other' step)
    if (mult2) {
      // multiply the current value by 2
      current *= 2;
      // If that value exceeds 9, subtract it by 9 to keep it in range
      if (current > 9) current -= 9;
    }
    // Add it to the total
    result += current;
    // Update the current step value
    mult2 = (mult2 + 1) % 2;
  }
  // Test if the result is a multiple of 10; return if it is
  if (result % 10 == 0) return 0;
  // If it's not, backtrack to the second to last digit in the string
  result -= +input[input.length - 1];
  // Identify the closet distance to the next multiple of 10 and return
  return 10 - (result % 10);
};

// Takes a credit card string value and returns true on valid number
app.post('/api/validate', (req: Request, res: Response, next: NextFunction) => {
  try {
    const luhnResult: number = luhnChecksum(req.body.cardData);

    // A result of -1 indicates an erroneous result
    if (luhnResult === -1)
      return res
        .status(400)
        .json({ result: 'Error: Invalid character(s) detected' });
    // A result of 0 indicates a valid answer
    else if (luhnResult === 0)
      return res.status(200).json({ result: 'Card accepted' });
    // Otherwise, the checksum failed but we return the number that would next validate it
    else
      return res
        .status(401)
        .json({ result: 'Change last digit to ' + luhnResult });
  } catch (e) {
    return next({
      log: "Error in '/validate': " + e,
      status: 500,
      message: { err: e },
    });
  }
});

// Error handler
app.use(
  (error: ExpressError, _req: Request, res: Response, _next: NextFunction) => {
    const defaultError = {
      log: 'Error in unknown middleware',
      status: 500,
      message: { err: 'Error in server' },
    };

    error = Object.assign({}, defaultError, error);

    console.log(error.log);
    return res.status(error.status).json(error.message);
  }
);

app.listen(PORT, () => {
  console.log('Server listening on PORT ' + PORT);
});
