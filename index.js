import React from 'react';
import PropTypes from 'prop-types';

import DEFAULT_OPTIONS from './options';
import Sly from 'slyer';

const ITEMS_PER_ROW = 5;

class ReactSly extends React.PureComponent {
  constructor(p) {
    super(p);

    // instance of sly
    this.frame = null;
    this.sly = null; // ref of root el
    this.resizeHandler = this.resizeHandler.bind(this);
  }

  componentDidMount() {
    if (!this.frame) {
      let options = {};
      options.prevPage = this.sly.querySelector('.sly-button-prev');
      options.nextPage = this.sly.querySelector('.sly-button-next');
      const containerWidth = this.sly.offsetWidth;

      const itemEls = this.sly.querySelectorAll('.slidee > li');
      Array.prototype.forEach.call(itemEls, el => {
        el.style.width = containerWidth / this.props.itemsPerRow + 'px';
      });

      this.frame = new Sly(
        this.sly,
        Object.assign(options, this.props.options)
      ).init();

      if (this.props.onInit) {
        this.props.onInit(this.frame);
      }
    } else {
      this.frame.reload();
    }
    window.addEventListener('resize', this.resizeHandler, true);
  }

  resizeHandler() {
    if (this.frame) {
      this.frame.reload();
    }
  }

  componentWillUnmount() {
    this.frame.destroy();

    window.removeEventListener('resize', this.resizeHandler);
  }

  render() {
    return React.cloneElement(this.props.children, {
      ref: el => {
        this.sly = el;
      }
    });
  }
}

ReactSly.propTypes = {
  onInit: PropTypes.func,
  itemsPerRow: PropTypes.number
};

ReactSly.defaultProps = {
  itemsPerRow: ITEMS_PER_ROW
};

export default ReactSly;
