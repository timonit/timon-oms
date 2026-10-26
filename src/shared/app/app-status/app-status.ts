export abstract class AppStatus {
  abstract name: string;

  isStatus<S extends AppStatus>(StatusClass: new () => S): this is S {
    const statusClassName = StatusClass.name;
    return statusClassName === this.constructor.name;
  }
}
