import React  from 'react';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Ani>Headline News: 日本、来年７月から商業捕鯨再開へ…ＩＷＣ脱退 2018年12月26日 11時53分</Ani>
      </div>
    );
  }
}

// Animation by requestAnimationFrame
class Ani extends React.Component {
  constructor(props) {
    super(props);
    this.inc = true;
    this.state = {
      pos: 100
    };
    this.loop = this.loop.bind(this);  // or provide the callback (() => this.loop())
  }

  componentDidMount() {
    if (!this._frameId)  // start loop, be sure to bind the loop function
      this._frameId = window.requestAnimationFrame(this.loop);
  }

  componentWillUnmount() {  // stop loop
    window.cancelAnimationFrame(this._frameId);
  }

  loop(timestamp) {
    let p = this.state.pos;
    if (this.inc) p+=1;
    else          p-=1;
    if      (p >= 600) this.inc = false;
    else if (p <= 100) this.inc = true;
    this.setState(st => ({
      pos: p
    }));

    this._frameId = window.requestAnimationFrame(this.loop);
  }

  render() {
    let hue = this.state.pos % 360;
    let stl = {
      position: 'absolute',
      top: this.state.pos,
      left: 20,
      color: `hsla(${hue},100%,50%)`
    };
    return <div style={stl}>{this.props.children}</div>
  }
}

export default App;
