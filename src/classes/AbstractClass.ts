import { v4 as uuid } from 'uuid';

export abstract class AbstractClass {
  public id: string = uuid();
}
