import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

export default class ContentModal extends Plugin {
  init() {
    const editor = this.editor

    const modalConfig = editor.config.get('contentModalConfig')
    let buttonCopy = 'Insert content'
    if (modalConfig && modalConfig.ctaCopy) {
      buttonCopy = modalConfig.ctaCopy
    }
    editor.ui.componentFactory.add('contentModal', locale => {
      const view = new ButtonView(locale)

      view.set({
        label: buttonCopy,
        tooltip: true,
        withText: true,
      })

      // Callback executed once the image is clicked.
      view.on('execute', () => {
        modalConfig.openModalHandler(editor)
      })

      return view
    })
  }
}
