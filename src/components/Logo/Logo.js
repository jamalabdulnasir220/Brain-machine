import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {

    return (
      <div className='ma4 mt0'>
          <Tilt style={{width: '100px'}} className='Tilt'>
            <div style={{ height: '100px'}}>
            <h1><img src={brain} alt='brain'/></h1>
            </div>
          </Tilt>
      </div>
    );
}

export default Logo;
