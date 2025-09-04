export type Connection = {
  CONNECTION_STRING: string;
  DB: string;
  DB_NAME: string;
};

export const connection: Connection = {
  CONNECTION_STRING: 'postgresql://admin:password@localhost:5432/nestjs-db',
  DB: 'POSTGRES',
  DB_NAME: 'TEST',
};
