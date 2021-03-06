import React, { Component } from 'react';
import GameHeader from './GameHeader.jsx';
import {Game, GameStatuses} from '../api/models/game.js';
import {newGame, userJoinGame, userLeaveGame, userStartGame, userSwitchMode, userShuffle} from '../api/methods/games.js';

export default class GameList extends Component {
  handleNewGame() {
    newGame.call({});
  }

  handleLeaveGame(gameId) {
    userLeaveGame.call({gameId: gameId});
  }

  handleJoinGame(gameId) {
    userJoinGame.call({gameId: gameId});
  }

  handleEnterGame(gameId) {
    this.props.enterGameHandler(gameId);
  }

  handleStartGame(gameId) {
    userStartGame.call({gameId: gameId});
    this.props.startGameHandler(gameId);
  }

  handleSwitchMode(gameId) {
    userSwitchMode.call({gameId: gameId});
  }

  handleShufflePlayers(gameId) {
    userShuffle.call({gameId: gameId});
  }

  activeGames() {
    return _.filter(this.props.games, (game) => {
      return game.status === GameStatuses.WAITING || game.status === GameStatuses.STARTED;
    });
  }

  myCurrentGameId() {
    let game = _.find(this.activeGames(), (game) => {
      return game.userIndex(this.props.user) !== null;
    });
    return game === undefined? null: game._id;
  }

  renderPlayers(game) {
    let player1 = game.players.length > 0? game.players[0].username: '(Waiting)';
    let player2 = game.players.length > 1? game.players[1].username: '(Waiting)';
    let player3 = game.players.length > 2? game.players[2].username: '(Waiting)';
    let player4 = game.players.length > 3? game.players[3].username: '(Waiting)';
    let player5 = game.players.length > 4? game.players[4].username: '(Waiting)';
    let player6 = game.players.length > 5? game.players[5].username: '(Waiting)';
    let player7 = game.players.length > 6? game.players[6].username: '(Waiting)';
    let player8 = game.players.length > 7? game.players[7].username: '(Waiting)';
    return (
      <div>
        <div>
          <i className="user icon"></i> {player1}
        </div>
        <div>
          <i className="user icon"></i> {player2}
        </div>
        <div>
          <i className="user icon"></i> {player3}
        </div>
        <div>
          <i className="user icon"></i> {player4}
        </div>
        <div>
          <i className="user icon"></i> {player5}
        </div>
        <div>
          <i className="user icon"></i> {player6}
        </div>
        <div>
          <i className="user icon"></i> {player7}
        </div>
        <div>
          <i className="user icon"></i> {player8}
        </div>
      </div>
    )
  }

  renderSettings(game) {
    if (this.myCurrentGameId() === game._id && game.status === GameStatuses.WAITING && game.gameMode == 'First Wins') {
      return (
        <div className="ui two item menu">
          <a className="blue item active">First Wins</a>
          <a className="blue item" onClick={this.handleSwitchMode.bind(this, game._id)}>Last Loses</a>
        </div>
      )
    } else if (this.myCurrentGameId() === game._id && game.status === GameStatuses.WAITING && game.gameMode == 'Last Loses') {
      return (
        <div className="ui two item menu">
          <a className="blue item" onClick={this.handleSwitchMode.bind(this, game._id)}>First Wins</a>
          <a className="blue item active">Last Loses</a>
        </div>
      )
    } else if (game.gameMode == 'First Wins'){
      return (
        <div className="ui two item menu">
          <a className="blue item active">First Wins</a>
          <a className="blue item">Last Loses</a>
        </div>
      )
    } else {
      return (
        <div className="ui two item menu">
          <a className="blue item">First Wins</a>
          <a className="blue item active">Last Loses</a>
        </div>
      )
    }
  }

  render() {
    return (
    <div className="ui container">
      <GameHeader user={this.props.user}/>

      <h1 className="ui top attached header">List of games</h1>
      <div className="ui attached segment">
        <div className="ui three cards">
          {this.activeGames().map((game, index) => {
            return (
              <div key={game._id} className="ui card">
                <div className="content">
                  <div className="header">
                    {game.status === GameStatuses.WAITING? (
                      <span className="ui right yellow corner label">
                        <i className="idea icon"/>
                      </span>
                    ): null}
                    Game {index+1}
                  </div>
                </div>
                <div className="content">
                  {this.renderPlayers(game)}
                </div>

                <div className="extra content">
                  {this.renderSettings(game)}
                </div>

                <div className="extra content">
                  {/* can leave only if user is in the game, and the game is not started */}
                  {this.myCurrentGameId() === game._id && game.status === GameStatuses.WAITING? (
                    <button className="ui red button" onClick={this.handleLeaveGame.bind(this, game._id)}>Leave</button>
                  ): null}

                  {this.myCurrentGameId() === game._id && game.players.length > 2 && game.status === GameStatuses.WAITING?  (
                    <button className="ui button" onClick={this.handleShufflePlayers.bind(this, game._id)}>Shuffle</button>
                  ): null}

                  {/* can start if 2+ players and currently in game*/}
                  {this.myCurrentGameId() === game._id && game.players.length > 1 && game.status === GameStatuses.WAITING?  (
                    <button className="ui button" onClick={this.handleStartGame.bind(this, game._id)}>Start</button>
                  ): null}

                  {/* can join only if user is not in any game, and the game is not started */}
                  {this.myCurrentGameId() === null && game.status === GameStatuses.WAITING? (
                    <button className="ui green button" onClick={this.handleJoinGame.bind(this, game._id)}>Join</button>
                  ): null}

                  {/* can enter only if the game is started */}
                  {game.status === GameStatuses.STARTED? (
                    <button className="ui blue button" onClick={this.handleEnterGame.bind(this, game._id)}>Enter</button>
                  ): null}

                  {/* just a invisible dummy button to make up the space */}
                  <button className="ui button" style={{visibility: "hidden"}}>Dummy</button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Only show new game button if player is not in any room */}
      </div>
      <div className="ui attached segment">
        {this.myCurrentGameId() === null? (
          <div>
            <button className="ui green button" onClick={this.handleNewGame.bind(this)}>New Game</button>
          </div>
        ): null}
      </div>
    </div>
    )
  }
}
