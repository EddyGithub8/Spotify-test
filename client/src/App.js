import React from 'react'
import Spotify from 'spotify-web-api-js'
import SpotifyLogin from 'react-spotify-login'
import {withRouter, Route, Redirect} from 'react-router-dom'

import './App.css'
import search from './search.svg'

import ArtistView from './Components/ArtistView'
import BrowseAlbum from './Components/BrowseAlbum'

const clientId = '49827bb58c3c47c8ae7ced3eb2baf4f7'
const redirectUri = 'http://localhost:3000'

const spotifyWebApi = new Spotify()

class App extends React.Component{
  constructor(){
    super()
    
    const defaultState = {
      artists: [],
      albums: [],

      name: "",

      searchValue: "",
      isTokenValid: false,
    }

    this.state = JSON.parse(sessionStorage.getItem('state')) || defaultState
  }

  updateStateElement = (key, value)=> {
    this.setState({
      [key]: value
    }, () => sessionStorage.setItem('state', JSON.stringify(this.state)))
  }

  handleClick = (name) => {
    const option = {
      limit: 50,
    }
    
    const query = "artist:" + "\"" + name + "\""
    spotifyWebApi.searchAlbums(query, option)
      .then((response) => {
        
        let sortedAlbum = []
        response.albums.items.map(album => {
          album.artists.map(artist => {
            if(artist.name === name)
              sortedAlbum.push(album)
          })
        })
        this.updateStateElement("albums", sortedAlbum)
        this.updateStateElement("name", name)
      })

    this.props.history.push("/artist")
  }

  handleChange = (event) => {
    const {value} = event.target
    this.updateStateElement("searchValue", value)
    const option = {
      limit: 50,
    }

    spotifyWebApi.searchArtists(value, option)
      .then((response) => {
        this.updateStateElement("artists", response.artists.items)
      })
  }

  handleKey = (event) => {
    if(event.keyCode === 13)
      this.handleChange(event)
  }

  handleFailure = () => {
      this.props.history.push('/wasted')
      this.updateStateElement("isTokenValid", false)
  }

  handleSuccess = (token) => {
    if(token.access_token === null)
      return

    spotifyWebApi.setAccessToken(token.access_token)
    this.updateStateElement("isTokenValid", true)
    this.props.history.push("/search")
  }

  render(){
    const canSearchBarAppear = this.props.history.location.pathname === "/search" 
                                      && this.state.isTokenValid

    return (
      <div className="App">
          <Route exact path = "/" component = {() => 
              (<SpotifyLogin clientId = {clientId}
                      redirectUri = {redirectUri}
                      onFailure = {this.handleFailure}
                      onSuccess = {this.handleSuccess} />)}/><br />

          {canSearchBarAppear &&
          (<div style = {{position: "absolute", top: 10, left: "35%"}}>
            <input placeholder = "Search for an Artist..."
              value = {this.state.searchValue}
            onChange = { this.handleChange } 
            onKeyDown = { this.handleKey } className = "search"/>
            <img src = { search } alt = "" className = "searchIcon"/>
          </div>)}<br />

          <Route path = "/search" component = {() => (                 
                <div style = {{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                  { this.state.artists.map(artist => (
                  <ArtistView key = {artist.id} artist = {artist}
                  handleClick = {this.handleClick}/>)) }
                </div>)} />

          <Route path = "/artist" component = 
          {() => (<BrowseAlbum albums = {this.state.albums} name = {this.state.name}/>)} />

          <Route path = "/wasted" component = {() => <h1>Wasted</h1>}/>
      </div>
    )
  }
}
export default withRouter(App)
