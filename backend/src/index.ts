import app from './app';
import { AppDataSource } from './data-source';

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
