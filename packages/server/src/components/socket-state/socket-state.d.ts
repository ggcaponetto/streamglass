// Whatever shape your state has
type State = { [key: string]: unknown };

// Constructor signature
interface StateConstructor {
    new (): State;
}
