import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import Dialog from 'material-ui/Dialog'
import {
  Editor,
  createEditorState,
  ImageSideButton,
  addNewBlock,
  Block,
} from 'medium-draft'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
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
import colorHex from './colorHex'
import CreateNoteModalActions from './CreateNoteModalActions'

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
      title: this.state.title,
      color: this.state.color,
    })
  }

  focus() {
    this.refs.editor.focus()
  }

  handleChange(tags) {
    this.setState({ tags })
  }

  trash() {
    this.props.trashNote(
      { name: this.props.createdNoteState.name, folder: this.props.createdNoteState.folder },
      this.props.createdNoteState.meta,
      this.props.createdNoteState.path
    )
    this.props.closeCreateNoteModal()
  }

  archive() {
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
    const handleCloseColorMenu = (open, reason) => {
      if (open) {
        this.setState({ colorMenuOpen: true })
      } else {
        this.setState({ colorMenuOpen: false })
      }
    }

    const handleCloseMenu = (open, reason) => {
      if (open) {
        this.setState({ open: true })
      } else {
        this.setState({ open: false })
      }
    }

    const title = (
      <input type="text" value={this.state.title} onChange={this.updateTitleState} placeholder="Title" />
    )

    const colorState = this.state.color

    return (
      <div>
        <Dialog
          actions={
            [
              <CreateNoteModalActions
                handleColorChange={this.handleColorChange}
                handleCloseColorMenu={handleCloseColorMenu}
                handleCloseMenu={handleCloseMenu}
                closeCreateNoteModal={this.props.closeCreateNoteModal}
                archiveFunc={this.archive}
                deleteFunc={this.trash}
                createNote={this.createNote}
                notePath={this.props.createdNoteState.path}
                colorMenuOpen={this.state.colorMenuOpen}
                color={this.state.color}
                open={this.state.open}
                tags={this.state.tags}
                allTags={this.props.allTags}
                handleChange={this.handleChange}
              />
            ]
          }
          modal={false}
          open={this.props.createNoteModalOpen}
          onRequestClose={this.props.closeCreateNoteModal}
          autoScrollBodyContent
          contentClassName={colorHex(this.state.color).className}
          actionsContainerStyle={{ borderTop: 'none' }}
          title={title}
          titleStyle={{
            fontFamily: "'Roboto Condensed',arial,sans-serif",
            border: 'none',
            fontSize: '17px',
            lineHeight: '23px',
            padding: '24px 24px 10px',
            backgroundColor: colorHex(colorState).code,
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
