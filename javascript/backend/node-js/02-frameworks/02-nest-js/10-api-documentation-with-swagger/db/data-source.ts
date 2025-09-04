import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres123',
  database: 'spotify-clone',
  entities: ['dist/**/*.entity.js'], // Step 1
  synchronize: false, // Step 2
  migrations: ['dist/db/migrations/*.js'], // Step 3
};

const dataSource = new DataSource(dataSourceOptions); // Step 4
export default dataSource;
