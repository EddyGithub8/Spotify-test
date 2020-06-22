import React from 'react'
import _ from 'lodash'
import Spotify from 'spotify-web-api-js'
import SpotifyLogin from 'react-spotify-login'
import {withRouter, Route } from 'react-router-dom'

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
      next: "",

      searchValue: "",
      token: "",
    }

    this.state = JSON.parse(sessionStorage.getItem('state')) || defaultState

    this.searchArtist = _.debounce(this.searchArtist, 50)
  }

  handleScroll = () => {
    const windowHeight = "innerHeight" in window ? 
        window.innerHeight : document.documentElement.offsetHeight

    const body = document.body
    const html = document.documentElement

    const docHeight = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight)

    const windowBottom = windowHeight + window.pageYOffset

    
    if (windowBottom + 1500 >= docHeight && this.state.next) {
      spotifyWebApi.getGeneric(this.state.next)
      .then(response => {
        this.updateStateElement("next", response.artists.next)
        this.state.artists.push(...response.artists.items)
      }).catch(this.handleFailure)
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  updateStateElement = (key, value)=> {
    this.setState({
      [key]: value
    }, () => sessionStorage.setItem('state', JSON.stringify(this.state)))
  }

  handleClick = (id, name) => {
    const option = {
      limit: 50,
    }
    
    spotifyWebApi.getArtistAlbums(id, option)
      .then((response) => {
        this.updateStateElement("name", name)
        this.updateStateElement("albums", response.items)
      })

    this.props.history.push("/artist/id=" + id)
  }

  searchArtist = (value, option) => {
      spotifyWebApi.searchArtists(value, option)
        .then((response) => {
          console.log(response)
          this.updateStateElement("next", response.artists.next)
          this.updateStateElement("artists", response.artists.items)
        }).catch(() => {this.handleFailure()})    
  }

  handleChange = (event) => {
    const {value} = event.target
    this.updateStateElement("searchValue", value)

    if(value === "")
      return
    const option = {
      limit: 50,
    }

    this.searchArtist(value, option)
  }

  handleKey = (event) => {
    if(event.keyCode === 13)
      this.handleChange(event)
  }

  handleFailure = () => {
      this.props.history.push('/wasted')
  }

  handleSuccess = (token) => {
    if(token.access_token === null)
      return

    spotifyWebApi.setAccessToken(token.access_token)
    this.updateStateElement("token", token.access_token)
    this.props.history.push("/search")
  }

  render(){
    const canSearchBarAppear = this.props.history.location.pathname === "/search" 
                                      && this.state.token !== ""

    return (
      <div className="App">
          <Route exact path = "/" component = {() => 
              (<SpotifyLogin className = "login"
                      clientId = {clientId}
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
          {() => (<BrowseAlbum albums = {this.state.albums}
           id = {this.state.currentId} name = {this.state.name}/>)} />

          <Route path = "/wasted" component = {() => <h1 style = {{color: "black"}}>Wasted</h1>}/>
      </div>
    )
  }
}
export default withRouter(App)
