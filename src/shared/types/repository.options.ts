import { EntityManager } from 'typeorm';

export type RepositoryOptions = {
  manager?: EntityManager;
  relations?: string[];
};
