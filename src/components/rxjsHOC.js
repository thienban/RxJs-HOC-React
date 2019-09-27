import React from 'react';
import { BehaviorSubject } from 'rxjs';

const withObservableStream = (
    observable,
    triggers,
    initialState
) => Component => {
  return class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          ...initialState,
        };
      }

    componentDidMount() {
        this.subscription = observable.subscribe(newState =>
            this.setState({ ...newState }),
          );
    }
    componentWillUnmount() {
        this.subscription.unsubscribe();
    }
    render() {
      return (
        <Component {...this.props} {...this.state} {...this.triggers}/>
      );
    }
  };
};
const App = ({ query = '', onChangeQuery }) => (
  <div>
    <h1>React with RxJS</h1>
    <input
      type="text"
      value={query}
      onChange={event => onChangeQuery(event.target.value)}
    />
    <p>{`http://hn.algolia.com/api/v1/search?query=${query}`}</p>
  </div>
);

const query$ = new BehaviorSubject({ query: 'react' });
export default withObservableStream(
  query$,
  {
    onChangeQuery: value => query$.next({ query: value }),
  },{
    query: '',
  }
)(App);
