// Sharing behaviour between components:
//  Mixins -> HOC -> Render Props
import React from 'react';

// HOC that adds an animation facility to a component.
// Provide a new prop, data, that the wrapped component uses to render its output.
// function Animate(WrappedCom, init, delta) {
export const Animate = (WrappedCom) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.prevTS = 0;
      this.tick = this.tick.bind(this);
      this.state = { data: 0 }
    }

    componentDidMount() {
      if (!this._frId)
        this._frId = requestAnimationFrame(this.tick);
      console.log(this._frId);
    }

    componentWillUnmount() {
      window.cancelAnimationFrame(this._frId);
    }

    tick(ts) { // timestamp
      if (ts >= this.prevTS + this.props.interval) { // skip the loop for this tick
        this.prevTS = ts;
        this.setState({ data: this.state.data + this.props.delta });
      }
      this._frId = requestAnimationFrame(this.tick);
    }

    render() {
      // renders the wrapped component with the fresh data!
      // pass through any additional props
      return <WrappedCom data={this.state.data} {...this.props} />;
    }
  };
}

// Render Props
export class AniRP extends React.Component {
  constructor(props) {
    super(props);
    this.prevTS = 0;
    this.tick = this.tick.bind(this);
    this.state = { data: 0 }
  }

  componentDidMount() {
    if (!this._frId)
      this._frId = requestAnimationFrame(this.tick);
    console.log(this._frId);
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this._frId);
  }

  tick(ts) { // timestamp
    if (ts >= this.prevTS + this.props.interval) { // skip the loop for this tick
      this.prevTS = ts;
      this.setState({ data: this.state.data + this.props.delta });
    }
    this._frId = requestAnimationFrame(this.tick);
  }

  render() {
    return <>{this.props.render(this.state.data)}</>;
  }
}
