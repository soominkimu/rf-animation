// Sharing behaviour between components:
//  Mixins -> HOC -> Render Props
// React Hooks
import React from 'react';
import './App.css';
import { Animate, AniRP } from './sqAni-old';
import { useAniFrame } from './sqAni';

const App = () => {
  const L = 200;
  const delay = 1000;
  const Δ = 0.1;
  const AniHOC = Animate(Graphic);
  AniElement0();

  return (
    <div className="App">
    <React.StrictMode>
      <AniDirect color="LightGreen" text="Direct" width={L} height={L}
        interval={delay} delta={Δ} />
      <AniHOC color="Coral" text="HOC" width={L} height={L}
        interval={delay} delta={Δ} />
      <AniRP render={data => <Graphic color="SkyBlue" text="Render Prop" width={L} height={L} data={data} />}
        interval={delay} delta={Δ} />
      <AniHook color="Aqua" text="Hooks" width={L} height={L}
        interval={delay} delta={Δ} />
      <AniElement />
    </React.StrictMode>
    </div>
  );
}

// Direct
class AniDirect extends React.Component {
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

  componentWillUnmount() {  // stop loop
    window.cancelAnimationFrame(this._frId);
  }

  tick(ts) { // timestamp
    const elapsed = ts - this.prevTS;
    if (elapsed < this.props.interval) { // skip the loop for this tick
      this._frId = requestAnimationFrame(this.tick);
      return;
    }
    this.prevTS = ts;
    this.setState({ data: this.state.data + this.props.delta });
    this._frId = requestAnimationFrame(this.tick);
  }

  render() {
    return <Graphic data={this.state.data} {...this.props} />
  }
}

class Graphic extends React.Component {
  constructor(props) {
    super(props);
    // Refs provides a way to access DOM nodes or React elements created in the render method.
    this.canvasRef = React.createRef();
    this.paint = this.paint.bind(this);
  }

  componentDidUpdate() {
    this.paint();
  }

  paint() {
    const { width, height, data, color, text } = this.props;
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(100, 100);
    ctx.rotate(data, 100, 100);
    ctx.fillStyle = color;
    ctx.fillRect(-50, -50, 100, 100);
    ctx.font = '18px Impact';
    ctx.fillStyle = "Black";
    ctx.fillText(text, -45, 0);
    ctx.restore();
  }

  render() {
    return <canvas ref={this.canvasRef} width={this.props.width} height={this.props.height} />;
  }
}

const AniHook = props => {
  const canvasRef = React.useRef(null);
  const data = useAniFrame(props.interval, props.delta);  // delay

  React.useEffect(() => {
    const { width, height, color, text } = props;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(100, 100);
    ctx.rotate(data, 100, 100);
    ctx.fillStyle = color;
    ctx.fillRect(-50, -50, 100, 100);
    ctx.font = '18px Impact';
    ctx.fillStyle = "Black";
    ctx.fillText(text, -45, 0);
    ctx.restore();
  }, [data]);

  return <canvas ref={canvasRef} width={props.width} height={props.height} />;
}

// MDN sample: window.requestAnimationFrame()
// Imperatively control a DOM element
const AniElement0 = () => {
  let start = null;
  const el = document.getElementById("title1");

  const tick = ts => {
    if (!start)
      start = ts;
    const elapsed = ts - start;
    el.style.transform = `translateX(${Math.min(elapsed/10, 200)}px)`;
    if (elapsed < 2000) {
      window.requestAnimationFrame(tick);
    }
  }
  window.requestAnimationFrame(tick);
}

// Declarative
const AniElement = () => {
  const [style, setStyle] = React.useState(null);
  let start = null;

  React.useEffect(() => {
    const tick = ts => {
      if (!start)
        start = ts;
      const elapsed = ts - start;
      setStyle(`translateX(${Math.min(elapsed/10, 400)}px)`);
      //console.log(style);  // prints null
      if (elapsed < 4000) {  // repeat frame for 4s.
        window.requestAnimationFrame(tick);
      }
    }
    window.requestAnimationFrame(tick);
  }, []);  // run once

  return <div style={{transform: style}}><h1>Animation Test</h1></div>;
}

export default App;
