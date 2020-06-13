
import React from 'react'
import PropTypes from 'prop-types'

const TagButton = ({text, classes, onClick}) => (
    <div className="btn-group" role="group">
            <button type="button" className={classes} onClick= {onClick}>
              {text}
            </button>
    </div>
    
)

TagButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    classes: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }

export default TagButton;