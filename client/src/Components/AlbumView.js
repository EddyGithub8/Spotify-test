import React from "react"

import "./ArtistView.css"

import logo from "./logo.svg"

class AlbumView extends React.Component{
    state = {
        album: this.props.album
    }
    

    render() {
        const image = this.state.album.images[0]
        let artistNames = ""
        this.state.album.artists.map(artist => {
            artistNames += artist.name + ", "
        })
        artistNames = artistNames.slice(0, artistNames.length - 2)
        return(
            <div className = "main">
                <img src = {image ? image.url : logo} alt = ""
                    className = "circular-square"/><br />
                <div className = "name">{this.state.album.name}</div>
                <div className = "subname">
                    {artistNames.slice(0, 80)}
                    {artistNames.length > 80 && "..."}
                </div><br />
                <div style = {{position: "absolute", bottom: 40, padding: 0}}>
                    <div className = "subname">{this.state.album.release_date}</div>
                    <div className = "subname">{this.state.album.total_tracks} tracks</div>
                </div>
                <a target = "_blank" href = {this.state.album.external_urls.spotify}
                 className = "previewLink">
                    <button className = "previewbutton">Preview Spotify</button>
                </a>
            </div>
        )
    }
}

export default AlbumView