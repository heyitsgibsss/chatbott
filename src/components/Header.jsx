import { render } from '@testing-library/react';
import React, {Component} from 'react';

class Header extends Component {
    render() {
      return (
        <div className="sticky-header">
          <div className="card-header">
            <p>Hermes AI</p>
          </div>
        </div>
      );
    }
  }
  
  export default Header;