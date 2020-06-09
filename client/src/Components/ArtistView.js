import React from 'react'
import Spotify from 'spotify-web-api-js'
import NumberFormat from 'react-number-format'

import './ArtistView.css'

import logo from './logo.svg'
import star from './icons8-star-filled-96.png'
import halfStar from './icons8-star-half-96.png'

const spotifyWebApi = new Spotify()


class ArtistView extends React.Component{
    state = {
        artist: this.props.artist,
    }

    handleClick = () => {
        spotifyWebApi.searchAlbums("artist:" + this.state.artist.name)
            .then(response => {
                console.log(response)
            })
    }

    render(){
        const image = this.state.artist.images[0]

        const starRating = this.state.artist.popularity / 20
        let starNumber = Math.floor(starRating)

        if(starRating - starNumber > 0.7)
            ++starNumber

        const rating = []
        for(var i = 0; i < starNumber; ++i){
            rating.push(<img src = {star} className = "star" key = {this.state.artist.id + "_" + i} alt = ""/>)
        }
        if(starRating - starNumber > 0.25)
            rating.push(<img src = {halfStar} className = "star" key = {this.state.artist.id + "_0.5"} alt = ""/>)
        
        return(
            <div className = "main" style = {{cursor: "pointer"}}
             onClick = {() => this.props.handleClick(this.state.artist.name)}>

                <img src = {image ? image.url : logo } alt = "" 
                className = "circular-square"/><br />
                <div>
                    <div className = "name">
                        {this.state.artist.name.slice(0, 80)}
                        {this.state.artist.name.length > 80 && "..."}
                    </div>
                    <div className = "subname"> 
                        <NumberFormat value = {this.state.artist.followers.total}
                        displayType={'text'} thousandSeparator={true}  /> followers
                    </div>
                </div>
                <div style = {{position: "absolute", bottom: 10}}>{rating}</div>              
            </div>
        )
    }
}

export default ArtistView