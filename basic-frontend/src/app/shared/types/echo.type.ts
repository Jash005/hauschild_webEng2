export interface Echo {
  _id: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateEchoInput = Pick<Echo, 'message'>;
