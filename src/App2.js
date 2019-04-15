import React  from 'react';
import './App.css';

class App extends React.Component {
  render() {
    const AniGraphic = Animate(Graphic, data => (data + 0.04));

    return (
      <div className="App">
        <AniGraphic width={200} height={200} />
      </div>
    );
  }
}

// HOC
function Animate(WrappedCom, action) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.tick = this.tick.bind(this);
      this.state = {
        data: 0
      }
    }

    componentDidMount() {
      this._frameId = requestAnimationFrame(this.tick);
    }

    componentWillUnmount() {  // stop loop
      window.cancelAnimationFrame(this._frameId);
    }

    tick() {
      this.setState({ data: action(this.props) });
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
