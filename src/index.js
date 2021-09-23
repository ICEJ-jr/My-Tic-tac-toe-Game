import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

  
  function Square(props){
    return(
        <button className="square"
         onClick={props.onClick}
         style={{'backgroundColor': props.highlight ? '#9c0d06': 'none'}}>
          {props.value}
        </button>
    );
  }


  class Board extends React.Component {
    renderSquare(i) {
      return (<Square key={i} 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight = {calculateWinner(this.props.squares)[1].includes(i)}
        />
      );
    }
    render() {
      console.log(calculateWinner(this.props.squares)[1]);
      return (
        Array(3).fill(0).map((_,i) => i).map((array,i) => 
          <div key={i} className="board-row">
               {Array(3).fill(0).map((_,i) => i).map((_, j) => this.renderSquare(3*i + j))}
          </div>
          )
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state={
            history:[{
                squares: Array(9).fill(null),
            }],
            pos: [],
            stepNumber: 0,
            xIsNext: true,
            selected: [false],
            reverse: false,
        };
    }

    handleClick(i){
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        const pos = this.state.pos.slice(0,this.state.stepNumber);
        if (calculateWinner(squares)[0] || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
            squares: squares,
            }]),
            pos: pos.concat(i),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            selected: Array(this.state.selected.length).fill(false),
        });
    }

    jumpTo(step){
        // console.log('step:' + step);
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            selected: Array(step).fill(false).concat(true),
        });
    }

    getPosition(loc){
        return '(' + (Math.floor(this.state.pos[loc]/3)+1) + ',' + (this.state.pos[loc]%3 + 1) + ')';
    }

    handleToggler(){
      this.setState({
        reverse: !this.state.reverse,
      })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares)[0];


      let moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move + ' @ '+ this.getPosition(move-1) : 
          'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => this.jumpTo(move)} style={{'fontWeight' :  this.state.selected[move] ? 'bold': 'normal'}}>
                    {desc}
                </button>
            </li>
        );
      })

      let status;
      if(winner){
          status = 'Winner: ' + winner;
      }else if (!current.squares.includes(null)){
        status = 'This is a draw';
      }else{
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }  
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={()=>this.handleToggler()}>Toggle Order</button>
            <ol>{this.state.reverse ? moves.reverse() : moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[c] === squares[b] && squares[a] === squares[c]) {
        return [squares[a],lines[i]];
      }
    }
    return [null,[-1,-1,-1]];
  }