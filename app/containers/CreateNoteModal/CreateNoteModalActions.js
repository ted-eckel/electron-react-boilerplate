import React, { Component } from 'react'
import TagsInput from 'react-tagsinput'
import Autosuggest from 'react-autosuggest'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import ActionLabel from 'material-ui/svg-icons/action/label'
import ActionDone from 'material-ui/svg-icons/action/done'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import ImagePalette from 'material-ui/svg-icons/image/palette'
import FlatButton from 'material-ui/FlatButton'
import ReactTooltip from 'react-tooltip'
import colorButtons from './colorButtons'

export default class CreateNoteModalActions extends Component {
  render() {
    const allTags = this.props.allTags

    function autocompleteRenderInput({ addTag, ...props }) {
      const handleOnChange = (e, { newValue, method }) => {
        if (method === 'enter') {
          e.preventDefault()
        } else {
          props.onChange(e)
        }
      }

      const inputValue = (props.value && props.value.trim().toLowerCase()) || ''
      const inputLength = inputValue.length

      const suggestions = Object.keys(allTags)
        .map(id => allTags[id]).sort((a, b) => a.path - b.path)
        .filter(tag => tag.name.toLowerCase().slice(0, inputLength) === inputValue)

      return (
        <Autosuggest
          ref={props.ref}
          suggestions={suggestions}
          alwaysRenderSuggestions
          getSuggestionValue={(suggestion) => suggestion.name}
          renderSuggestion={(suggestion) => <span>{suggestion.path}</span>}
          inputProps={{ ...props, onChange: handleOnChange }}
          onSuggestionSelected={(e, { suggestion }) => {
            addTag(suggestion)
          }}
          onSuggestionsClearRequested={() => {}}
          onSuggestionsFetchRequested={() => {}}
        />
      )
    }

    const defaultRenderLayout = (tagComponents, inputComponent) => (
      <div>
        {tagComponents}
        <div className="item-toolbar" style={{ padding: '0 15px' }}>
          <IconMenu
            onRequestChange={(open, reason) => this.props.handleCloseColorMenu(open, reason)}
            open={this.props.colorMenuOpen}
            iconButtonElement={
              <IconButton className="dialog-toolbar-button">
                <ImagePalette data-tip="change color" />
              </IconButton>
            }
            autoWidth={false}
            menuStyle={{ width: '174px', height: '115px' }}
          >
            <div style={{ width: '124px', margin: '0 25px' }}>
              {colorButtons(this.props.handleColorChange, this.props.color)}
            </div>
            <ReactTooltip place="bottom" type="dark" effect="solid" />
          </IconMenu>
          <IconMenu
            onRequestChange={(open, reason) => this.props.handleCloseMenu(open, reason)}
            open={this.props.open}
            iconButtonElement={
              <IconButton className="dialog-toolbar-button">
                <ActionLabel
                  data-tip={this.props.tags.length ? 'change tags' : 'add tags'}
                />
              </IconButton>
            }
            width={200}
          >
            {inputComponent}
          </IconMenu>
          <IconButton disabled={this.props.notePath === 'new'} onTouchTap={() => this.props.archiveFunc()} className="dialog-toolbar-button">
            <ActionDone data-tip="archive" />
          </IconButton>
          <IconButton disabled={this.props.notePath === 'new'} onTouchTap={() => this.props.deleteFunc()} className="dialog-toolbar-button">
            <ActionDelete data-tip="trash" />
          </IconButton>
          <FlatButton
            label="Cancel"
            onTouchTap={() => this.props.closeCreateNoteModal()}
            style={{ color: '#202020' }}
          />
          <FlatButton
            label="Save Note"
            onTouchTap={this.props.createNote}
            style={{ color: '#202020' }}
          />
        </div>
        <ReactTooltip place="bottom" type="dark" effect="solid" />
      </div>
    )

    const defaultRenderTag = props => {
      const {
        tag,
        key,
        disabled,
        onRemove,
        classNameRemove,
        getTagDisplayValue,
        ...other
      } = props

      return (
        <span key={key} {...other}>
          <span style={{
            whiteSpace: 'nowrap',
            maxWidth: '130px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'inline-block',
            verticalAlign: 'top'
          }}
          >
            {getTagDisplayValue(typeof tag === 'object' ? tag.name : tag)}
          </span>
          {!disabled &&
            <a className={classNameRemove} onClick={() => onRemove(key)} />
          }
        </span>
      )
    }

    return (
      <TagsInput
        onlyUnique
        renderInput={autocompleteRenderInput}
        value={this.props.tags}
        onChange={this.props.handleChange}
        renderLayout={defaultRenderLayout}
        renderTag={defaultRenderTag}
      />
    )
  }
}
