import React from 'react'
import {withRouter} from 'react-router-dom'
import AlbumView from './AlbumView'

import './ArtistView.css'

class BrowseAlbum extends React.Component{
    constructor(props){
        super(props)    
        this.state = {
            albums: props.albums,
            name: props.name,
        }
    }

    render() { 
        return(
            <div>
                <div className = "mainname">{this.state.name}</div>
                <div className = "subtitle">albums</div><br /><br />
                <div style = {{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
                    {this.state.albums.map(album => (
                    <AlbumView key = {album.id} album = {album}/>
                    ))}
                </div>
            </div>
        )
    }
}

export default withRouter(BrowseAlbum)