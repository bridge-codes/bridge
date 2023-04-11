import { onError } from 'bridge';

export default onError(({ error, path }) => {
  console.log(path, error);
  if (error.name === 'Internal server error') {
    console.error(path, error);
    // Send to bug reporting
  } else {
    // Normal http errors
  }
});
