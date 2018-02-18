import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import ActionLabel from 'material-ui/svg-icons/action/label'
import ActionDone from 'material-ui/svg-icons/action/done'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import ImagePalette from 'material-ui/svg-icons/image/palette'
import Paper from 'material-ui/Paper'
import {
  Editor,
  createEditorState,
  ImageSideButton,
  addNewBlock,
  Block,
} from 'medium-draft'
// import 'medium-draft/lib/index.css'
import TagsInput from 'react-tagsinput'
import Autosuggest from 'react-autosuggest'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import htmlConvert from '../utils/files/notes/importer'
// import { convertToRaw } from 'draft-js'
import exporter from '../../utils/files/notes/exporter'
import jsonExporter from '../../utils/files/notes/jsonExporter'
import {
  createNoteModalOpenSelector,
  createdNoteSelector,
  allTagsSelector,
} from '../../selectors'
import { createOrUpdateNote, archiveNote, trashNote } from '../../actions/files/notes'
import { trashFiles, archiveFiles } from '../../actions/files'
import { toggleCreateNoteModal, closeCreateNoteModal } from '../../actions/app'
import colorHexName from './colorHexName'
import colorHex from './colorHex'

const mapStateToProps = state => ({
  createNoteModalOpen: createNoteModalOpenSelector(state),
  createdNoteState: createdNoteSelector(state),
  path: state.paths,
  allTags: allTagsSelector(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
  createOrUpdateNote,
  trashFiles,
  archiveFiles,
  toggleCreateNoteModal,
  closeCreateNoteModal,
  archiveNote,
  trashNote
}, dispatch)

class CustomImageSideButton extends ImageSideButton {
  onChange(e) {
    const file = e.target.files[0]
    console.log(file)
    if (file.type.indexOf('image/') === 0) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const src = reader.result
        this.props.setEditorState(addNewBlock(
          this.props.getEditorState(),
          Block.IMAGE,
          { src, }
        ))
      }
    }
    this.props.close()
  }
}

class CreateNoteModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      title: (
        props.createdNoteState.meta.title ?
          props.createdNoteState.meta.title :
          ''
      ),
      editorState: (
        props.createdNoteState.content ?
          createEditorState(props.createdNoteState.content) :
          createEditorState()
      ),
      color: props.createdNoteState.meta.color,
      tags: (
        (props.createdNoteState.meta && props.createdNoteState.meta.tagIDs) ?
          props.createdNoteState.meta.tagIDs.map(tagID => props.allTags[tagID]) :
          []
      ),
      open: false,
      colorMenuOpen: false,
    }

    this.onChange = (editorState) => {
      this.setState({ editorState })
    }

    this.sideButtons = [{
      title: 'Image',
      component: CustomImageSideButton,
    }]

    this.updateTitleState = this.updateTitleState.bind(this)
    this.createNote = this.createNote.bind(this)
    // this.disabledButton = this.disabledButton.bind(this)
    this.focus = this.focus.bind(this)

    this.handleChange = this.handleChange.bind(this)

    this.handleColorChange = this.handleColorChange.bind(this)
    this.trash = this.trash.bind(this)
    this.archive = this.archive.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.createdNoteState !== nextProps.createdNoteState) {
      this.setState({
        title: (nextProps.createdNoteState.meta.title ?
          nextProps.createdNoteState.meta.title :
          ''
        ),
        editorState: createEditorState(nextProps.createdNoteState.content),
        color: nextProps.createdNoteState.meta ? nextProps.createdNoteState.meta.color : 'DEFAULT',
        tags: (
          nextProps.createdNoteState.meta.tagIDs ?
            nextProps.createdNoteState.meta.tagIDs.map(tagID => this.props.allTags[tagID]) :
            []
        ),
      })
    }
  }

  updateTitleState(event) {
    this.setState({ title: event.target.value })
  }

  createNote() {
    const nameString = this.props.createdNoteState.name ? this.props.createdNoteState.name : null
    const name = (nameString && nameString.length) ? nameString : null
    const { path } = this.props
    const tagIDs = []
    const newTags = []
    this.state.tags.forEach(tag => (typeof tag === 'object' ? (tagIDs.push(tag.id)) : newTags.push(tag)))

    const currentContent = this.state.editorState.getCurrentContent()

    this.props.closeCreateNoteModal()

    this.props.createOrUpdateNote({
      content: exporter(currentContent),
      state: 'INBOX',
      dir: path.DEFAULT_NOTES_DIR,
      name,
      tagIDs,
      newTags,
      ...this.state
    })
  }

  focus() {
    this.refs.editor.focus()
  }

  handleChange(tags) {
    this.setState({ tags })
  }

  trash() {
    // this.props.trashFiles(id)
    this.props.trashNote(
      { name: this.props.createdNoteState.name, folder: this.props.createdNoteState.folder },
      this.props.createdNoteState.meta,
      this.props.createdNoteState.path
    )
    this.props.closeCreateNoteModal()
  }

  archive() {
    // this.props.archiveFiles(id)
    this.props.archiveNote(
      { name: this.props.createdNoteState.name, folder: this.props.createdNoteState.folder },
      this.props.createdNoteState.meta,
      this.props.createdNoteState.path
    )
    this.props.closeCreateNoteModal()
  }

  handleColorChange(color) {
    this.setState({ color })
  }

  render() {
    const item = this.props.createdNoteState
    const colorArray = ['DEFAULT', 'RED', 'ORANGE', 'YELLOW', 'GRAY', 'BLUE', 'TEAL', 'GREEN']

    const colorCheckMark = color => {
      if (this.state.color) {
        if (this.state.color === color) {
          return (
            <ActionDone />
          )
        } else if (this.state.color === 'DEFAULT' && color === 'WHITE') {
          return (
            <ActionDone />
          )
        }
      } else if (color === 'WHITE') {
        return (
          <ActionDone />
        )
      } else {
        return null
      }
    }

    const colorDataTip = (color) => {
      if (color) {
        if (color === 'DEFAULT') {
          return 'white'
        }
        return color.toLowerCase()
      }
      return null
    }

    const colorButtons = colorArray.map(color => (
      <Paper
        circle
        key={`${item.id}-${color}-DIALOG`}
        data-tip={colorDataTip(color)}
        onClick={() => this.handleColorChange(color)}
        style={{
          backgroundColor: colorHex(color),
          height: '25px',
          width: '25px',
          display: 'inline-block',
          margin: '3px',
          cursor: 'pointer',
          verticalAlign: 'top'
        }}
      >
        {colorCheckMark(color)}
      </Paper>
    ))

    const handleCloseColorMenu = (open, reason) => {
      if (open) {
        this.setState({ colorMenuOpen: true })
      } else {
        this.setState({ colorMenuOpen: false })
      }
    }

    const allTags = this.props.allTags

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

      // let suggestions = tags.filter((tag) => (
      //   tag.toLowerCase().slice(0, inputLength) === inputValue
      // ))
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

    const handleCloseMenu = (open, reason) => {
      if (open) {
        this.setState({ open: true })
      } else {
        this.setState({ open: false })
      }
    }

    const defaultRenderLayout = (tagComponents, inputComponent) => {
      const archive = this.archive
      const deleteFunc = this.trash
      const notePath = this.props.createdNoteState.path
      return (
        <div>
          {tagComponents}
          <div className="item-toolbar" style={{ padding: '0 15px' }}>
            <IconMenu
              onRequestChange={(open, reason) => handleCloseColorMenu(open, reason)}
              open={this.state.colorMenuOpen}
              iconButtonElement={
                <IconButton className="dialog-toolbar-button">
                  <ImagePalette data-tip="change color" />
                </IconButton>
              }
              autoWidth={false}
              menuStyle={{ width: '174px', height: '115px' }}
            >
              <div style={{ width: '124px', margin: '0 25px' }}>
                {colorButtons}
              </div>
              <ReactTooltip place="bottom" type="dark" effect="solid" />
            </IconMenu>
            <IconMenu
              onRequestChange={(open, reason) => handleCloseMenu(open, reason)}
              open={this.state.open}
              iconButtonElement={
                <IconButton className="dialog-toolbar-button">
                  <ActionLabel
                    data-tip={this.state.tags.length ? 'change tags' : 'add tags'}
                  />
                </IconButton>
              }
              width={200}
            >
              {inputComponent}
            </IconMenu>
            <IconButton disabled={notePath === 'new'} onTouchTap={() => archive()} className="dialog-toolbar-button">
              <ActionDone data-tip="archive" />
            </IconButton>
            <IconButton disabled={notePath === 'new'} onTouchTap={() => deleteFunc()} className="dialog-toolbar-button">
              <ActionDelete data-tip="trash" />
            </IconButton>
            <FlatButton
              label="Cancel"
              onTouchTap={() => this.props.closeCreateNoteModal()}
              style={{ color: '#202020' }}
            />
            <FlatButton
              label="Save Note"
              onTouchTap={this.createNote}
              disabled={false /* this.disabledButton() */}
              style={{ color: '#202020' }}
            />
          </div>
          <ReactTooltip place="bottom" type="dark" effect="solid" />
        </div>
      )
    }

    const createNoteModalActions = [
      <TagsInput
        onlyUnique
        renderInput={autocompleteRenderInput}
        value={this.state.tags}
        onChange={this.handleChange}
        renderLayout={defaultRenderLayout}
        renderTag={defaultRenderTag}
      />
    ]

    const title = (
      <input type="text" value={this.state.title} onChange={this.updateTitleState} placeholder="Title" />
    )

    const colorState = this.state.color

    return (
      <div>
        <Dialog
          actions={createNoteModalActions}
          modal={false}
          open={this.props.createNoteModalOpen}
          onRequestClose={this.props.closeCreateNoteModal}
          autoScrollBodyContent
          contentClassName={colorHexName(this.state.color)}
          actionsContainerStyle={{ borderTop: 'none' }}
          title={title}
          titleStyle={{
            fontFamily: "'Roboto Condensed',arial,sans-serif",
            border: 'none',
            fontSize: '17px',
            lineHeight: '23px',
            padding: '24px 24px 10px',
            backgroundColor: colorHex(colorState),
            width: '93%'
          }}
          titleClassName="createNoteModalTitle"
        >
          <div
            onClick={this.focus}
            style={{
              fontFamily: "'Roboto Slab','Times New Roman',serif",
              color: '#000',
              fontSize: '14px',
              lineHeight: '19px'
            }}
          >
          {/* <div
            onClick={this.focus}
          > */}
            <Editor
              ref="editor"
              placeholder="Write here. Type [ ] to add a todo ..."
              editorState={this.state.editorState}
              onChange={this.onChange}
              sideButtons={this.sideButtons}
            />
          </div>
        </Dialog>
        <ReactTooltip place="bottom" type="dark" effect="solid" />
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNoteModal)
