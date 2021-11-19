import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/pencil.svg'

export default class ContentModal extends Plugin {
  init() {
    const editor = this.editor

    const modalConfig = editor.config.get('contentModalConfig')

    editor.ui.componentFactory.add('contentModal', locale => {
      const view = new ButtonView(locale)

      view.set({
        label: 'Insert content',
        tooltip: true,
        icon: imageIcon,
      })

      // Callback executed once the image is clicked.
      view.on('execute', () => {
        modalConfig.openModalHandler(editor)
      })

      return view
    })
  }
}
