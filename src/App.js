// React Hooks
import React  from 'react';
import './App.css';

class App extends React.Component {
  render() {
    const AniGraphic = Animate(Graphic, 0, data => (data + 0.05));

    return (
      <div className="App">
        <AniGraphic width={200} height={200} interval={1} />
      </div>
    );
  }
}

// HOC that adds an animation facility to a component.
// Provide a new prop, data, that the wrapped component uses to render its output.
// function Animate(WrappedCom, init, change) {
const Animate = (WrappedCom, init, change) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.lastTS = 0;
      this.tick = this.tick.bind(this);
      this.state = {
        data: init
      }
      console.log(props);
    }

    componentDidMount() {
      if (!this._frameId)
        this._frameId = requestAnimationFrame(this.tick);
    }

    componentWillUnmount() {
      window.cancelAnimationFrame(this._frameId);
    }

    tick(timestamp) {
      let elapsed = timestamp - this.lastTS;
      if (elapsed < this.props.interval) { // skip the loop for this tick
        this._frameId = requestAnimationFrame(this.tick);
        return;
      }
      this.lastTS = timestamp;
      this.setState({ data: change(this.state.data) });
      this._frameId = requestAnimationFrame(this.tick);
    }

    render() {
      // renders the wrapped component with the fresh data!
      // pass through any additional props
      return <WrappedCom data={this.state.data} {...this.props} />;
    }
  };
}

/*
class Ani extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rotation: 0 };
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this._frameId = requestAnimationFrame(this.tick);
  }

  componentWillUnmount() {  // stop loop
    window.cancelAnimationFrame(this._frameId);
  }

  tick() {
    const rotation = this.state.rotation + 0.04;
    this.setState({ rotation });
    this._frameId = requestAnimationFrame(this.tick);
  }

  render() {
    return <Graphic rotation={this.state.rotation} width={200} height={200} />
  }
}
*/

class Graphic extends React.Component {
  constructor(props) {
    super(props);
    this.paint = this.paint.bind(this);
  }

  componentDidUpdate() {
    this.paint();
  }

  paint() {
    const { width, height, data } = this.props;
    const ctx = this.refs.canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(100, 100);
    ctx.rotate(data, 100, 100);
    ctx.fillStyle = "#F00";
    ctx.fillRect(-50, -50, 100, 100);
    ctx.restore();
  }

  render() {
    const { width, height } = this.props;
    return (
      <canvas ref="canvas" width={width} height={height} />
    );
  }
}

export default App;
