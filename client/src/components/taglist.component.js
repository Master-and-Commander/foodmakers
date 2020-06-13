import React from 'react'
import PropTypes from 'prop-types'
import TagButton from './tagbutton.component'

const TagList = ({ tags, onTagClick }) => (
  <ul>
    {tags.map((tag, index) => (
      <TagButton text={tag.text} classes = {tag.classes} onClick={() => onTagClick(tag.id)} />
    ))}
  </ul>
)

TodoList.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      classes: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onTodoClick: PropTypes.func.isRequired
}

export default TagList